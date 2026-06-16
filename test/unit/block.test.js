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

    test("zoom is clamped to the supported range", () => {
        const block = new blockClass(runtime);
        block.setZoom({ ZOOM: 99 });
        expect(block.zoom).toBe(19);
        block.setZoom({ ZOOM: -5 });
        expect(block.zoom).toBe(0);
    });

    test("addPoint stores latitude, longitude and color", () => {
        const block = new blockClass(runtime);
        block.clearPoints();
        block.addPoint({ LAT: 34.702485, LNG: 135.495951, COLOR: "#00ff00" });
        expect(block._points).toHaveLength(1);
        expect(block._points[0]).toMatchObject({
            lat: 34.702485,
            lng: 135.495951,
            color: "#00ff00"
        });
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
            expect(stageX(block, p.LNG)).toBeGreaterThanOrEqual(0);
            expect(stageX(block, p.LNG)).toBeLessThanOrEqual(480);
            expect(stageY(block, p.LAT)).toBeGreaterThanOrEqual(0);
            expect(stageY(block, p.LAT)).toBeLessThanOrEqual(360);
        }
    });

    test("fit to a single point centers on it", () => {
        const block = new blockClass(runtime);
        block.clearPoints();
        block.addPoint({ LAT: 34.702485, LNG: 135.495951 });
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
