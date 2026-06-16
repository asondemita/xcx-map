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
        expect(info.id).toBe("gsiMap");
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
