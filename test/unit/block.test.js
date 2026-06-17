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
        expect(block.zoom).toBe(13);
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

    test("_fitZoomForBounds is low for a wide box, high for a tiny box", () => {
        const block = new blockClass(runtime);
        const wide = block._fitZoomForBounds(10, 30, 20, 40);
        const tiny = block._fitZoomForBounds(35.0, 35.001, 139.0, 139.001);
        expect(wide).toBeLessThan(tiny);
        expect(wide).toBeGreaterThanOrEqual(0);
    });

    test("_fitToBounds centers within the given lat/lng box", () => {
        const block = new blockClass(runtime);
        block._fitToBounds(34, 36, 135, 140); // south, north, west, east
        expect(block.centerLat).toBeGreaterThan(34);
        expect(block.centerLat).toBeLessThan(36);
        expect(block.centerLng).toBeGreaterThan(135);
        expect(block.centerLng).toBeLessThan(140);
        expect(block.zoom).toBeGreaterThanOrEqual(0);
        expect(block.zoom).toBeLessThanOrEqual(19);
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

    test("pin number menu lists on then off, default off", () => {
        const block = new blockClass(runtime);
        const values = block.getPinNumberMenu().map(i => i.value);
        expect(values).toEqual(["on", "off"]);
        expect(block._pinNumbered).toBe(false);
    });

    test("showMapByKeyword does not throw for empty keyword", () => {
        const block = new blockClass(runtime);
        expect(() => block.showMapByKeyword({ KEYWORD: "" })).not.toThrow();
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
