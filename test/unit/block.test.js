import { blockClass } from "../../src/vm/extensions/block/index.js";

describe("blockClass", () => {
    const runtime = {
        formatMessage: function (msg) {
            return msg.default;
        }
    };

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
        expect(block.mapLat()).toBeCloseTo(35.681236, 5);
        expect(block.mapLng()).toBeCloseTo(139.767125, 5);
        expect(block.mapZoom()).toBe(13);
    });

    test("zoom is clamped to the supported range", () => {
        const block = new blockClass(runtime);
        block.setZoom({ ZOOM: 99 });
        expect(block.mapZoom()).toBe(19);
        block.setZoom({ ZOOM: -5 });
        expect(block.mapZoom()).toBe(0);
    });

    test("the map center maps to stage origin", () => {
        const block = new blockClass(runtime);
        expect(block.lngToX({ LNG: block.mapLng() })).toBe(0);
        expect(block.latToY({ LAT: block.mapLat() })).toBe(0);
    });

    test("coordinate conversion round trips", () => {
        const block = new blockClass(runtime);
        const lng = block.xToLng({ X: 100 });
        expect(block.lngToX({ LNG: lng })).toBeCloseTo(100, 0);
        const lat = block.yToLat({ Y: 80 });
        expect(block.latToY({ LAT: lat })).toBeCloseTo(80, 0);
    });

    test("fit to points keeps every point inside the stage", () => {
        const block = new blockClass(runtime);
        const points = [
            { LAT: 35.681236, LNG: 139.767125 }, // Tokyo
            { LAT: 34.702485, LNG: 135.495951 }, // Osaka
            { LAT: 43.068661, LNG: 141.350755 }  // Sapporo
        ];
        block.clearPoints();
        for (const p of points) block.addPoint(p);
        block.fitToPoints();
        for (const p of points) {
            expect(Math.abs(block.lngToX({ LNG: p.LNG }))).toBeLessThanOrEqual(240);
            expect(Math.abs(block.latToY({ LAT: p.LAT }))).toBeLessThanOrEqual(180);
        }
    });

    test("draws one pin per on-stage point", () => {
        const block = new blockClass(runtime);
        // Stub the renderer state so _redraw's drawing path runs.
        const calls = { arc: 0 };
        const ctx = new Proxy({}, {
            get: (_t, prop) => {
                if (prop === "arc") return () => { calls.arc++; };
                if (prop === "measureText") return () => ({ width: 100 });
                return () => {};
            }
        });
        block._ctx = ctx;
        // Tokyo center at zoom 13: Tokyo is on-stage, Osaka is far off-stage.
        block.centerLat = 35.681236;
        block.centerLng = 139.767125;
        block.zoom = 13;
        const n = Math.pow(2, block.zoom);
        const left = block._lngToWorldX(block.centerLng, block.zoom) - 240;
        const top = block._latToWorldY(block.centerLat, block.zoom) - 180;
        block._points = [
            { lat: 35.681236, lng: 139.767125 }, // Tokyo (on stage)
            { lat: 34.702485, lng: 135.495951 }  // Osaka (off stage)
        ];
        expect(n).toBeGreaterThan(0);
        block._drawMarkers(ctx, block.zoom, left, top);
        // Each pin uses 2 arcs (head + center dot); only Tokyo is on-stage.
        expect(calls.arc).toBe(2);
    });

    test("fit to a single point centers on it", () => {
        const block = new blockClass(runtime);
        block.clearPoints();
        block.addPoint({ LAT: 34.702485, LNG: 135.495951 });
        block.fitToPoints();
        expect(block.mapLat()).toBeCloseTo(34.702485, 5);
        expect(block.mapLng()).toBeCloseTo(135.495951, 5);
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
