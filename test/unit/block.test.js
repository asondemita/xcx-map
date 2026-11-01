import { blockClass } from "../../src/vm/extensions/block/index.js";

describe("blockClass", () => {
    const runtime = {
        formatMessage: function (msg) {
            return msg.default;
        }
    };

    // Stage position of a coordinate under the block's current view.
    const stageX = (block, lng) =>
        block._lngToWorldX(lng, block.zoom) -
        (block._lngToWorldX(block.centerLng, block.zoom) - 240);
    const stageY = (block, lat) =>
        block._latToWorldY(lat, block.zoom) -
        (block._latToWorldY(block.centerLat, block.zoom) - 180);

    test("should create an instance of blockClass", () => {
        const block = new blockClass(runtime);
        expect(block).toBeInstanceOf(blockClass);
    });

    test("getInfo returns the extension id and blocks", () => {
        const block = new blockClass(runtime);
        const info = block.getInfo();
        expect(info.id).toBe("map");
        expect(Array.isArray(info.blocks)).toBe(true);
    });

    test("default map state is Tokyo Station", () => {
        const block = new blockClass(runtime);
        expect(block.centerLat).toBeCloseTo(35.681236, 5);
        expect(block.centerLng).toBeCloseTo(139.767125, 5);
        expect(block.zoom).toBe(14);
    });

    test("zoom is clamped per tile type", () => {
        const block = new blockClass(runtime);
        // default is OSM standard -> max zoom 19
        block.setZoom({ ZOOM: 99 });
        expect(block.zoom).toBe(19);
        block.setZoom({ ZOOM: -5 });
        expect(block.zoom).toBe(0);
        // GSI pale -> max zoom 18
        block.setMapType({ TYPE: "pale" });
        block.setZoom({ ZOOM: 99 });
        expect(block.zoom).toBe(18);
    });

    test("default tile type is OSM standard and switches to GSI pale", () => {
        const block = new blockClass(runtime);
        expect(block._mapType).toBe("osm");
        expect(block._tileConfig().base).toContain("openstreetmap.org");
        block.setMapType({ TYPE: "pale" });
        expect(block._mapType).toBe("pale");
        expect(block._tileConfig().base).toContain("gsi.go.jp");
        // an unknown value is ignored
        block.setMapType({ TYPE: "bogus" });
        expect(block._mapType).toBe("pale");
    });

    test("map type menu lists standard first, then pale", () => {
        const block = new blockClass(runtime);
        const values = block.getMapTypeMenu().map(i => i.value);
        expect(values).toEqual(["osm", "pale"]);
    });

    test("map center latitude/longitude reporters return the center", () => {
        const block = new blockClass(runtime);
        block.centerLat = 35.5;
        block.centerLng = 139.5;
        expect(block.mapLat()).toBe(35.5);
        expect(block.mapLng()).toBe(139.5);
    });

    test("panning moves the center east and north for positive pixels", () => {
        const block = new blockClass(runtime);
        const lng0 = block.centerLng;
        const lat0 = block.centerLat;
        block.panHorizontal({ PIXELS: 100 });
        expect(block.centerLng).toBeGreaterThan(lng0); // east
        block.panVertical({ PIXELS: 100 });
        expect(block.centerLat).toBeGreaterThan(lat0); // north
    });

    test("opacity is clamped to 0..100", () => {
        const block = new blockClass(runtime);
        block.setOpacity({ OPACITY: 250 });
        expect(block._opacity).toBe(100);
        block.setOpacity({ OPACITY: -40 });
        expect(block._opacity).toBe(0);
    });

    test("pin color menu lists eight colors as hex values", () => {
        const block = new blockClass(runtime);
        const menu = block.getPinColorMenu();
        expect(menu).toHaveLength(8);
        for (const item of menu) {
            expect(item.value).toMatch(/^#[0-9a-f]{6}$/i);
            expect(typeof item.text).toBe("string");
        }
    });

    test("addCenterPin stores the current center with its color", () => {
        const block = new blockClass(runtime);
        block.clearPoints();
        block.centerLat = 34.702485;
        block.centerLng = 135.495951;
        block.addCenterPin({ COLOR: "#00ff00" });
        expect(block._points).toHaveLength(1);
        expect(block._points[0]).toMatchObject({
            lat: 34.702485,
            lng: 135.495951,
            color: "#00ff00"
        });
    });

    test("setPinName sets the named pin (1-based), truncates to 6 + ...", () => {
        const block = new blockClass(runtime);
        block._points = [{ lat: 0, lng: 0 }, { lat: 1, lng: 1 }];
        block.setPinName({ NUMBER: 2, NAME: "あいうえおかきく" });
        expect(block._points[1].name).toBe("あいうえおか...");
        expect(block._points[0].name).toBeUndefined();
        // short name kept as-is; overwriting works
        block.setPinName({ NUMBER: 2, NAME: "やあ" });
        expect(block._points[1].name).toBe("やあ");
        // out-of-range -> no throw / no change
        expect(() => block.setPinName({ NUMBER: 9, NAME: "x" })).not.toThrow();
    });

    test("setLastPinName names the most recent pin", () => {
        const block = new blockClass(runtime);
        block._points = [{ lat: 0, lng: 0 }, { lat: 1, lng: 1 }];
        block.setLastPinName({ NAME: "ゴール" });
        expect(block._points[1].name).toBe("ゴール");
        expect(block._points[0].name).toBeUndefined();
        // no pins -> no throw
        block._points = [];
        expect(() => block.setLastPinName({ NAME: "x" })).not.toThrow();
    });

    test("a named pin draws its bubble text", () => {
        const block = new blockClass(runtime);
        const texts = [];
        const ctx = new Proxy({}, {
            get: (_t, prop) => {
                if (prop === "fillText") return t => texts.push(t);
                if (prop === "measureText") return () => ({ width: 20 });
                return () => {};
            }
        });
        block.centerLat = 35.681236;
        block.centerLng = 139.767125;
        block.zoom = 13;
        const left = block._lngToWorldX(block.centerLng, block.zoom) - 240;
        const top = block._latToWorldY(block.centerLat, block.zoom) - 180;
        block._points = [{ lat: 35.681236, lng: 139.767125, color: "#e53935", name: "ここ" }];
        block._drawMarkers(ctx, block.zoom, left, top);
        expect(texts).toContain("ここ");
    });

    test("pinDistance measures between two pins (1-based), '' if invalid", () => {
        const block = new blockClass(runtime);
        block._points = [
            { lat: 35.681236, lng: 139.767125 }, // pin 1 Tokyo
            { lat: 34.702485, lng: 135.495951 }  // pin 2 Osaka
        ];
        const km = block.pinDistance({ FROM: 1, TO: 2 });
        expect(km).toBeGreaterThan(390);
        expect(km).toBeLessThan(420);
        expect(block.pinDistance({ FROM: 1, TO: 5 })).toBe("");
    });

    test("scrollBetweenPins no-ops for invalid pins and ends at the target", () => {
        const block = new blockClass(runtime);
        block._points = [
            { lat: 10, lng: 20 },
            { lat: 30, lng: 40 }
        ];
        expect(block.scrollBetweenPins({ FROM: 1, TO: 9 })).toBeUndefined();
        const startZoom = block.zoom;
        return block.scrollBetweenPins({ FROM: 1, TO: 2 }).then(() => {
            expect(block.centerLat).toBeCloseTo(30, 6);
            expect(block.centerLng).toBeCloseTo(40, 6);
            // the arc returns to the starting zoom at the end
            expect(block.zoom).toBe(startZoom);
        });
    }, 15000);

    test("_smoothZoomPath hits both endpoints and zooms out in the middle", () => {
        const block = new blockClass(runtime);
        const path = block._smoothZoomPath(0, 0, 480, 1000, 0, 480);
        const a = path(0);
        const mid = path(0.5);
        const b = path(1);
        expect(a.x).toBeCloseTo(0, 6);
        expect(a.w).toBeCloseTo(480, 6);
        expect(b.x).toBeCloseTo(1000, 6);
        expect(b.w).toBeCloseTo(480, 6);
        // the viewport widens (zooms out) partway through
        expect(mid.w).toBeGreaterThan(480);
    });

    test("pins draw their order number only when numbering is on", () => {
        const block = new blockClass(runtime);
        const texts = [];
        const ctx = new Proxy({}, {
            get: (_t, prop) => {
                if (prop === "fillText" || prop === "strokeText") {
                    return t => texts.push(t);
                }
                return () => {};
            }
        });
        block.centerLat = 35.681236;
        block.centerLng = 139.767125;
        block.zoom = 13;
        const left = block._lngToWorldX(block.centerLng, block.zoom) - 240;
        const top = block._latToWorldY(block.centerLat, block.zoom) - 180;
        block._points = [{ lat: 35.681236, lng: 139.767125, color: "#e53935" }];
        // default off -> no number text
        block._drawMarkers(ctx, block.zoom, left, top);
        expect(texts).not.toContain("1");
        // turn on -> "1" is drawn
        block.setPinNumber({ MODE: "on" });
        block._drawMarkers(ctx, block.zoom, left, top);
        expect(texts).toContain("1");
    });

    describe("center mark (lines / cross / none)", () => {
        const makeCtx = () => {
            const calls = { moveTo: [], lineTo: [], arc: [], stroke: 0, dash: null, styles: [], widths: [] };
            const ctx = new Proxy({}, {
                get: (_t, prop) => {
                    if (prop === "moveTo") return (x, y) => calls.moveTo.push([x, y]);
                    if (prop === "lineTo") return (x, y) => calls.lineTo.push([x, y]);
                    if (prop === "arc") return (x, y, r) => calls.arc.push([x, y, r]);
                    if (prop === "stroke") return () => { calls.stroke += 1; };
                    if (prop === "setLineDash") return d => { calls.dash = d; };
                    return () => {};
                },
                set: (_t, prop, value) => {
                    if (prop === "strokeStyle") calls.styles.push(value);
                    if (prop === "lineWidth") calls.widths.push(value);
                    return true;
                }
            });
            return { ctx, calls };
        };

        test("lines: dotted hairlines through the stage center", () => {
            const block = new blockClass(runtime);
            block.setCenterLines({ MODE: "on" });
            expect(block._centerMark).toBe("line");
            const { ctx, calls } = makeCtx();
            block._drawCenterMark(ctx);
            expect(calls.stroke).toBe(1);
            // vertical line at stage x = 0 (canvas x = 240), horizontal at y = 0 (canvas y = 180)
            expect(calls.moveTo).toEqual([[240.5, 0], [0, 180.5]]);
            expect(calls.lineTo).toEqual([[240.5, 360], [480, 180.5]]);
            expect(calls.dash).toEqual([3, 3]);
        });

        test("cross (default): four short arms with a gap plus a circle, halo then red", () => {
            const block = new blockClass(runtime);
            expect(block._centerMark).toBe("cross");
            const { ctx, calls } = makeCtx();
            block._drawCenterMark(ctx);
            expect(calls.stroke).toBe(2);
            expect(calls.dash).toEqual([]);
            // arms end 4px short of the center on every side (gap endpoints are
            // where one arm stops and the next starts)
            const points = calls.moveTo.concat(calls.lineTo);
            expect(points).toEqual(expect.arrayContaining([
                [240, 180 - 4], [240, 180 + 4], [240 - 4, 180], [240 + 4, 180]
            ]));
            // arm tips 16px out
            expect(points).toEqual(expect.arrayContaining([
                [240, 180 - 16], [240, 180 + 16], [240 - 16, 180], [240 + 16, 180]
            ]));
            expect(calls.arc).toEqual([[240, 180, 6]]);
            // white halo first (wide), then the red line on top
            expect(calls.styles).toEqual(["rgba(255, 255, 255, 0.85)", "#e53935"]);
            expect(calls.widths).toEqual([4, 2]);
        });

        test("off draws nothing; 'on' and unknown values fall back to lines", () => {
            const block = new blockClass(runtime);
            block.setCenterLines({ MODE: "off" });
            expect(block._centerMark).toBe("off");
            const { ctx, calls } = makeCtx();
            block._drawCenterMark(ctx);
            expect(calls.stroke).toBe(0);
            block.setCenterLines({ MODE: "on" });
            expect(block._centerMark).toBe("line");
            block.setCenterLines({ MODE: "cross" });
            block.setCenterLines({ MODE: "???" });
            expect(block._centerMark).toBe("line");
        });

        test("menu lists lines, cross, none", () => {
            const block = new blockClass(runtime);
            expect(block.getCenterLinesMenu().map(i => i.value)).toEqual(["on", "cross", "off"]);
        });
    });

    test("pin number menu lists on then off, default off", () => {
        const block = new blockClass(runtime);
        const values = block.getPinNumberMenu().map(i => i.value);
        expect(values).toEqual(["on", "off"]);
        expect(block._pinNumbered).toBe(false);
    });

    describe("mouse / touch control (drag, wheel, pinch)", () => {
        // lat/lng of the map point under a stage position
        const under = (block, x, y) => ({
            lat: block._worldYToLat(block._latToWorldY(block.centerLat, block.zoom) + y - 180, block.zoom),
            lng: block._worldXToLng(block._lngToWorldX(block.centerLng, block.zoom) + x - 240, block.zoom)
        });

        test("off by default outside the editor; the block turns it on and off", () => {
            const block = new blockClass(runtime);
            expect(block._mouseControl).toBe(false);
            // no document in node -> not the editor
            expect(block._isEditorMode()).toBe(false);
            expect(block._mouseControlActive()).toBe(false);
            block.setMouseControl({ MODE: "on" });
            expect(block._mouseControlActive()).toBe(true);
            block.setMouseControl({ MODE: "off" });
            expect(block._mouseControlActive()).toBe(false);
            expect(block.getMouseControlMenu().map(i => i.value)).toEqual(["on", "off"]);
        });

        test("one pointer drags the map by the moved stage pixels, zoom unchanged", () => {
            const block = new blockClass(runtime);
            const startX = block._lngToWorldX(block.centerLng, block.zoom);
            const startY = block._latToWorldY(block.centerLat, block.zoom);
            block._pointerDown(1, 240, 180);
            block._pointerMove(1, 300, 150); // drag right 60, up 30
            expect(block._lngToWorldX(block.centerLng, block.zoom)).toBeCloseTo(startX - 60, 6);
            expect(block._latToWorldY(block.centerLat, block.zoom)).toBeCloseTo(startY + 30, 6);
            expect(block.zoom).toBe(14);
            block._pointerUp(1);
            expect(block._gesture).toBeNull();
            // moves after release are ignored
            block._pointerMove(1, 400, 400);
            expect(block._lngToWorldX(block.centerLng, block.zoom)).toBeCloseTo(startX - 60, 6);
        });

        test("_zoomAt keeps the map point under the cursor fixed", () => {
            const block = new blockClass(runtime);
            const before = under(block, 100, 50);
            block._zoomAt(16, 100, 50);
            expect(block.zoom).toBe(16);
            const after = under(block, 100, 50);
            expect(after.lat).toBeCloseTo(before.lat, 9);
            expect(after.lng).toBeCloseTo(before.lng, 9);
            // and the center itself moved (it is no longer the fixed point)
            expect(block.centerLat).not.toBeCloseTo(35.681236, 5);
        });

        test("pinch: doubling the distance zooms in one level around the midpoint", () => {
            const block = new blockClass(runtime);
            const before = under(block, 240, 180);
            block._pointerDown(1, 200, 180);
            block._pointerDown(2, 280, 180); // dist 80
            block._pointerMove(1, 160, 180);
            block._pointerMove(2, 320, 180); // dist 160
            expect(block.zoom).toBe(15);
            const after = under(block, 240, 180);
            expect(after.lat).toBeCloseTo(before.lat, 9);
            expect(after.lng).toBeCloseTo(before.lng, 9);
            // lifting one finger re-anchors; the other keeps panning at the new zoom
            block._pointerUp(2);
            const x0 = block._lngToWorldX(block.centerLng, block.zoom);
            block._pointerMove(1, 170, 180);
            expect(block._lngToWorldX(block.centerLng, block.zoom)).toBeCloseTo(x0 - 10, 6);
        });

        test("wheel: small deltas accumulate, ~40px per zoom step, up = in", () => {
            const block = new blockClass(runtime);
            block._wheel(-10, 240, 180);
            block._wheel(-10, 240, 180);
            block._wheel(-10, 240, 180);
            expect(block.zoom).toBe(14);
            block._wheel(-10, 240, 180);
            expect(block.zoom).toBe(15);
            // a direction change resets the accumulator; one notch (100) = one step
            block._wheel(100, 240, 180);
            expect(block.zoom).toBe(14);
            // clamped at the tile source's max zoom
            block.zoom = 19;
            block._wheel(-100, 240, 180);
            expect(block.zoom).toBe(19);
        });
    });

    test("mapZoom reports the current zoom", () => {
        const block = new blockClass(runtime);
        expect(block.mapZoom()).toBe(14);
        block.setZoom({ ZOOM: 9 });
        expect(block.mapZoom()).toBe(9);
    });

    test("showMapByKeyword does not throw for empty keyword", () => {
        const block = new blockClass(runtime);
        expect(() => block.showMapByKeyword({ KEYWORD: "" })).not.toThrow();
    });

    describe("showMapByKeyword geocoding (Nominatim, then GSI address search)", () => {
        // Fake fetch: answers by URL host, counts requests.
        const installFetch = ({ nominatim, gsi }) => {
            const calls = { urls: [] };
            global.fetch = url => {
                calls.urls.push(url);
                const body = url.includes("nominatim.openstreetmap.org") ? nominatim : gsi;
                return Promise.resolve({ json: () => Promise.resolve(body) });
            };
            return calls;
        };

        afterEach(() => {
            delete global.fetch;
        });

        test("uses the Nominatim result and does not call GSI when found", async () => {
            const calls = installFetch({
                nominatim: [{ lat: "35.6584", lon: "139.7455",
                    boundingbox: ["35.657", "35.660", "139.744", "139.747"] }],
                gsi: [{ geometry: { coordinates: [141.36, 43.07] } }]
            });
            const block = new blockClass(runtime);
            block.zoom = 12;
            await block.showMapByKeyword({ KEYWORD: "東京タワー" });
            expect(calls.urls).toHaveLength(1);
            expect(calls.urls[0]).toContain("nominatim.openstreetmap.org/search");
            expect(calls.urls[0]).toContain(encodeURIComponent("東京タワー"));
            // centers on the result point; the bounding box no longer changes the zoom
            expect(block.centerLat).toBeCloseTo(35.6584, 4);
            expect(block.centerLng).toBeCloseTo(139.7455, 4);
            expect(block.zoom).toBe(12);
        });

        test("falls back to GSI address search when Nominatim finds nothing", async () => {
            const calls = installFetch({
                nominatim: [],
                gsi: [{ geometry: { coordinates: [139.745468, 35.658649] },
                    properties: { title: "東京都港区芝公園四丁目２番" } }]
            });
            const block = new blockClass(runtime);
            block.zoom = 5;
            await block.showMapByKeyword({ KEYWORD: "東京都港区芝公園4-2-8" });
            // zoom is kept for address results too
            expect(calls.urls).toHaveLength(2);
            expect(calls.urls[1]).toContain("msearch.gsi.go.jp/address-search/AddressSearch");
            expect(calls.urls[1]).toContain(encodeURIComponent("東京都港区芝公園4-2-8"));
            expect(block.centerLat).toBeCloseTo(35.658649, 5);
            expect(block.centerLng).toBeCloseTo(139.745468, 5);
            expect(block.zoom).toBe(5);
        });

        test("leaves the map unchanged when both services find nothing", async () => {
            installFetch({ nominatim: [], gsi: [] });
            const block = new blockClass(runtime);
            const { centerLat, centerLng, zoom } = block;
            await block.showMapByKeyword({ KEYWORD: "そんな場所はない" });
            expect(block.centerLat).toBe(centerLat);
            expect(block.centerLng).toBe(centerLng);
            expect(block.zoom).toBe(zoom);
        });

        test("falls back to GSI when the Nominatim request fails", async () => {
            global.fetch = url => {
                if (url.includes("nominatim.openstreetmap.org")) {
                    return Promise.reject(new Error("network"));
                }
                return Promise.resolve({ json: () => Promise.resolve(
                    [{ geometry: { coordinates: [135.496338, 34.701881] } }]
                ) });
            };
            const block = new blockClass(runtime);
            await block.showMapByKeyword({ KEYWORD: "大阪府大阪市北区梅田3-1-3" });
            expect(block.centerLat).toBeCloseTo(34.701881, 5);
            expect(block.centerLng).toBeCloseTo(135.496338, 5);
        });
    });

    test("showPinMap centers on the given pin, no-op if missing", () => {
        const block = new blockClass(runtime);
        block._points = [
            { lat: 10, lng: 20 },
            { lat: 35.5, lng: 139.5 }
        ];
        block.showPinMap({ NUMBER: 2 });
        expect(block.centerLat).toBe(35.5);
        expect(block.centerLng).toBe(139.5);
        expect(() => block.showPinMap({ NUMBER: 9 })).not.toThrow();
        // unchanged after the invalid call
        expect(block.centerLat).toBe(35.5);
    });

    test("plotData parses multiline CSV (lat,lng,name,color), appends pins", () => {
        const block = new blockClass(runtime);
        block._points = [{ lat: 0, lng: 0 }]; // existing pin stays
        block.plotData({
            DATA: "緯度,経度,名前,色\n35.68,139.76,東京,赤\n34.70,135.50,,青"
        });
        expect(block._points).toHaveLength(3); // header skipped, 1 existing + 2 new
        expect(block._points[1]).toMatchObject({ lat: 35.68, lng: 139.76, color: "#e53935", name: "東京" });
        // empty name -> no name set (no bubble)
        expect(block._points[2]).toMatchObject({ lat: 34.7, lng: 135.5, color: "#1e88e5" });
        expect(block._points[2].name).toBeUndefined();
    });

    test("plotData handles tab columns with spaces between rows (newlines lost)", () => {
        const block = new blockClass(runtime);
        block.clearPoints();
        // newlines turned into spaces on paste; tabs still delimit columns
        block.plotData({ DATA: "35.68\t139.76\t東京\t赤 34.70\t135.50\t大阪\t青" });
        expect(block._points).toHaveLength(2);
        expect(block._points[0]).toMatchObject({ lat: 35.68, lng: 139.76, name: "東京", color: "#e53935" });
        expect(block._points[1]).toMatchObject({ lat: 34.7, lng: 135.5, name: "大阪", color: "#1e88e5" });
    });

    test("plotData handles the reported sheet paste (tabs + numeric 3rd col, no newlines)", () => {
        const block = new blockClass(runtime);
        block.clearPoints();
        block.plotData({
            DATA: "36.63057\t140.01274\t4 36.07554\t139.49681\t4 35.48659\t139.41362\t3"
        });
        expect(block._points).toHaveLength(3);
        expect(block._points[0]).toMatchObject({ lat: 36.63057, lng: 140.01274, name: "4" });
        expect(block._points[2]).toMatchObject({ lat: 35.48659, lng: 139.41362, name: "3" });
    });

    test("plotData accepts space-separated rows (sheet tabs turned to spaces)", () => {
        const block = new blockClass(runtime);
        block.clearPoints();
        // newlines kept, but columns separated by spaces instead of tabs
        block.plotData({
            DATA: "36.63057    140.01274    4\n36.07554    139.49681    4\n35.48659    139.41362    3"
        });
        expect(block._points).toHaveLength(3);
        expect(block._points[0]).toMatchObject({ lat: 36.63057, lng: 140.01274, name: "4" });
        expect(block._points[2]).toMatchObject({ lat: 35.48659, lng: 139.41362, name: "3" });
    });

    test("removePin removes the numbered pin (1-based), no-op if missing", () => {
        const block = new blockClass(runtime);
        block._points = [{ lat: 1, lng: 1 }, { lat: 2, lng: 2 }, { lat: 3, lng: 3 }];
        block.removePin({ NUMBER: 2 });
        expect(block._points.map(p => p.lat)).toEqual([1, 3]);
        expect(() => block.removePin({ NUMBER: 9 })).not.toThrow();
        expect(block._points).toHaveLength(2);
    });

    test("addCenterPin drops a pin at the current map center", () => {
        const block = new blockClass(runtime);
        block.clearPoints();
        block.centerLat = 35.0;
        block.centerLng = 139.0;
        block.addCenterPin({ COLOR: "#1e88e5" });
        expect(block._points).toHaveLength(1);
        expect(block._points[0]).toMatchObject({
            lat: 35.0,
            lng: 139.0,
            color: "#1e88e5"
        });
    });

    test("fit to points keeps every point inside the stage", () => {
        const block = new blockClass(runtime);
        const points = [
            { LAT: 35.681236, LNG: 139.767125 }, // Tokyo
            { LAT: 34.702485, LNG: 135.495951 }, // Osaka
            { LAT: 43.068661, LNG: 141.350755 }  // Sapporo
        ];
        block._points = points.map(p => ({ lat: p.LAT, lng: p.LNG }));
        block.fitToPoints();
        for (const p of points) {
            expect(stageX(block, p.LNG)).toBeGreaterThanOrEqual(0);
            expect(stageX(block, p.LNG)).toBeLessThanOrEqual(480);
            expect(stageY(block, p.LAT)).toBeGreaterThanOrEqual(0);
            expect(stageY(block, p.LAT)).toBeLessThanOrEqual(360);
        }
    });

    test("fit to a single point centers on it", () => {
        const block = new blockClass(runtime);
        block._points = [{ lat: 34.702485, lng: 135.495951 }];
        block.fitToPoints();
        expect(block.centerLat).toBeCloseTo(34.702485, 5);
        expect(block.centerLng).toBeCloseTo(135.495951, 5);
    });

    test("draws one pin per on-stage point", () => {
        const block = new blockClass(runtime);
        const calls = { arc: 0 };
        const ctx = new Proxy({}, {
            get: (_t, prop) => {
                if (prop === "arc") return () => { calls.arc++; };
                return () => {};
            }
        });
        block.centerLat = 35.681236;
        block.centerLng = 139.767125;
        block.zoom = 13;
        const left = block._lngToWorldX(block.centerLng, block.zoom) - 240;
        const top = block._latToWorldY(block.centerLat, block.zoom) - 180;
        block._points = [
            { lat: 35.681236, lng: 139.767125, color: "#e53935" }, // Tokyo (on stage)
            { lat: 34.702485, lng: 135.495951, color: "#e53935" }  // Osaka (off stage)
        ];
        block._drawMarkers(ctx, block.zoom, left, top);
        // Each pin uses 2 arcs (head + center dot); only Tokyo is on-stage.
        expect(calls.arc).toBe(2);
    });

    test("showCurrentLocation does not throw without geolocation", () => {
        const block = new blockClass(runtime);
        expect(() => block.showCurrentLocation()).not.toThrow();
    });

    describe("current location reporters", () => {
        // Install a fake Geolocation API that answers with the given position
        // (or fails when position is null) and counts how often it was asked.
        const installGeolocation = position => {
            const calls = { count: 0 };
            global.navigator = {
                geolocation: {
                    getCurrentPosition: (onSuccess, onError) => {
                        calls.count += 1;
                        if (position) {
                            onSuccess({ coords: { latitude: position.lat, longitude: position.lng } });
                        } else {
                            onError(new Error("denied"));
                        }
                    }
                }
            };
            return calls;
        };

        afterEach(() => {
            delete global.navigator;
        });

        test("currentLat/currentLng return '' without geolocation", async () => {
            const block = new blockClass(runtime);
            expect(await block.currentLat()).toBe("");
            expect(await block.currentLng()).toBe("");
        });

        test("currentLat/currentLng return the device position without touching the map", async () => {
            installGeolocation({ lat: 34.702485, lng: 135.495951 });
            const block = new blockClass(runtime);
            expect(await block.currentLat()).toBeCloseTo(34.702485, 6);
            expect(await block.currentLng()).toBeCloseTo(135.495951, 6);
            // The map center stays at the default and no skin was created.
            expect(block.centerLat).toBeCloseTo(35.681236, 5);
            expect(block.centerLng).toBeCloseTo(139.767125, 5);
            expect(block._skinId).toBeNull();
        });

        test("currentLat/currentLng return '' when geolocation fails", async () => {
            installGeolocation(null);
            const block = new blockClass(runtime);
            expect(await block.currentLat()).toBe("");
            expect(await block.currentLng()).toBe("");
        });

        test("consecutive reads share one geolocation request", async () => {
            const calls = installGeolocation({ lat: 34.702485, lng: 135.495951 });
            const block = new blockClass(runtime);
            const [lat, lng] = await Promise.all([block.currentLat(), block.currentLng()]);
            expect(lat).toBeCloseTo(34.702485, 6);
            expect(lng).toBeCloseTo(135.495951, 6);
            expect(calls.count).toBe(1);
            // A later read within the cache window is served from the cache.
            await block.currentLat();
            expect(calls.count).toBe(1);
        });

        test("cached position expires", async () => {
            const calls = installGeolocation({ lat: 34.702485, lng: 135.495951 });
            const block = new blockClass(runtime);
            await block.currentLat();
            expect(calls.count).toBe(1);
            block._currentLocation.time -= 10000;
            await block.currentLat();
            expect(calls.count).toBe(2);
        });

        test("showCurrentLocation always asks the device and fills the cache", async () => {
            const calls = installGeolocation({ lat: 34.702485, lng: 135.495951 });
            const block = new blockClass(runtime);
            await block.currentLat();
            await block.showCurrentLocation();
            expect(calls.count).toBe(2);
            expect(block.centerLat).toBeCloseTo(34.702485, 6);
            expect(block.centerLng).toBeCloseTo(135.495951, 6);
            await block.currentLng();
            expect(calls.count).toBe(2);
        });
    });

    describe("reverse geocoding (addressAt / postcodeAt)", () => {
        const tokyo = {
            road: "エレベーター;地下1階", neighbourhood: "丸の内一丁目", quarter: "丸の内",
            city: "千代田区", "ISO3166-2-lvl4": "JP-13", postcode: "100-0005",
            country: "日本", country_code: "jp"
        };
        // Install a fake fetch that answers with the given Nominatim body
        // and counts requests.
        const installFetch = body => {
            const calls = { count: 0, urls: [] };
            global.fetch = url => {
                calls.count += 1;
                calls.urls.push(url);
                return Promise.resolve({ json: () => Promise.resolve(body) });
            };
            return calls;
        };

        afterEach(() => {
            delete global.fetch;
        });

        test("return '' without fetch", async () => {
            const block = new blockClass(runtime);
            expect(await block.addressAt({ LAT: 35.68, LNG: 139.76 })).toBe("");
            expect(await block.postcodeAt({ LAT: 35.68, LNG: 139.76 })).toBe("");
        });

        test("build a Japanese address and postal code from the Nominatim response", async () => {
            const calls = installFetch({ address: tokyo });
            const block = new blockClass(runtime);
            expect(await block.addressAt({ LAT: 35.681236, LNG: 139.767125 }))
                .toBe("東京都千代田区丸の内一丁目");
            expect(await block.postcodeAt({ LAT: 35.681236, LNG: 139.767125 })).toBe("100-0005");
            // Both reads of the same point share one request.
            expect(calls.count).toBe(1);
            expect(calls.urls[0]).toContain("nominatim.openstreetmap.org/reverse");
            expect(calls.urls[0]).toContain("lat=35.681236");
            expect(calls.urls[0]).toContain("lon=139.767125");
        });

        test("_formatAddress keeps 郡/村/字 order and drops duplicates", () => {
            const block = new blockClass(runtime);
            // 丁目 present -> the hamlet (a nearby named area) is left out.
            expect(block._formatAddress({
                road: "大通", neighbourhood: "大通西5丁目", hamlet: "狸小路", suburb: "中央区",
                city: "札幌市", subprovince: "石狩振興局", province: "北海道",
                region: "北海道地方", country_code: "jp"
            })).toBe("北海道札幌市中央区大通西5丁目");
            // Prefecture given explicitly is not duplicated from the ISO code.
            expect(block._formatAddress({
                city: "那覇市", province: "沖縄県", "ISO3166-2-lvl4": "JP-47", country_code: "jp"
            })).toBe("沖縄県那覇市");
            expect(block._formatAddress({
                quarter: "北城", hamlet: "森山", village: "白馬村", county: "北安曇郡",
                province: "長野県", country_code: "jp"
            })).toBe("長野県北安曇郡白馬村北城森山");
            expect(block._formatAddress({
                city_district: "パリ", city: "パリ", suburb: "4区",
                state: "イル＝ド＝フランス地域圏", country_code: "fr"
            })).toBe("イル＝ド＝フランス地域圏, パリ, 4区");
            expect(block._formatAddress(null)).toBe("");
            expect(block._formatAddress({ road: "大通" })).toBe("");
        });

        test("return '' when Nominatim reports an error or no address", async () => {
            installFetch({ error: "Unable to geocode" });
            const block = new blockClass(runtime);
            expect(await block.addressAt({ LAT: 0, LNG: 0 })).toBe("");
            expect(await block.postcodeAt({ LAT: 0, LNG: 0 })).toBe("");
        });

        test("return '' and do not cache when the request fails", async () => {
            let count = 0;
            global.fetch = () => {
                count += 1;
                return Promise.reject(new Error("network"));
            };
            const block = new blockClass(runtime);
            expect(await block.addressAt({ LAT: 35.68, LNG: 139.76 })).toBe("");
            expect(await block.addressAt({ LAT: 35.68, LNG: 139.76 })).toBe("");
            expect(count).toBe(2);
        });

        test("invalid coordinates return '' without a request", async () => {
            const calls = installFetch({ address: tokyo });
            const block = new blockClass(runtime);
            expect(await block.addressAt({ LAT: 91, LNG: 0 })).toBe("");
            expect(await block.postcodeAt({ LAT: 0, LNG: 181 })).toBe("");
            expect(calls.count).toBe(0);
        });

        test("cache is bounded", async () => {
            installFetch({ address: tokyo });
            const block = new blockClass(runtime);
            for (let i = 0; i < 205; i++) {
                await block.postcodeAt({ LAT: 10 + (i * 0.01), LNG: 10 });
            }
            expect(block._reverseGeocodeCache.size).toBe(200);
        });
    });

    test("_destinationPoint travels the right bearing and distance", () => {
        const block = new blockClass(runtime);
        const lat = 35.681236;
        const lng = 139.767125;
        const north = block._destinationPoint(lat, lng, 0, 1000);
        expect(north.lat).toBeGreaterThan(lat);
        expect(north.lng).toBeCloseTo(lng, 6);
        const east = block._destinationPoint(lat, lng, 90, 1000);
        expect(east.lng).toBeGreaterThan(lng);
        expect(east.lat).toBeCloseTo(lat, 4);
        // distance is ~1000 m
        const meters = block._haversineKm(lat, lng, east.lat, east.lng) * 1000;
        expect(meters).toBeGreaterThan(999);
        expect(meters).toBeLessThan(1001);
        // longitude wraps across the antimeridian into [-180, 180]
        const wrap = block._destinationPoint(0, 179.99, 90, 5000);
        expect(wrap.lng).toBeLessThan(0);
        expect(wrap.lng).toBeGreaterThan(-180);
    });

    test("moveByDistance with seconds<=0 jumps to the destination", () => {
        const block = new blockClass(runtime);
        block.centerLat = 35.681236;
        block.centerLng = 139.767125;
        const beforeLng = block.centerLng;
        block.moveByDistance({ DEGREES: 90, DISTANCE: 1000, SECONDS: 0 });
        expect(block.centerLng).toBeGreaterThan(beforeLng); // moved east
        expect(block.centerLat).toBeCloseTo(35.681236, 4);
    });

    test("distance between Tokyo and Osaka is about 400km", () => {
        const block = new blockClass(runtime);
        const km = block.distance({
            LAT1: 35.681236, LNG1: 139.767125,
            LAT2: 34.702485, LNG2: 135.495951
        });
        expect(km).toBeGreaterThan(390);
        expect(km).toBeLessThan(420);
    });
});
