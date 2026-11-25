import { VectorMapRenderer, labelExpression } from "../../src/vm/extensions/block/vector-map.js";

describe("VectorMapRenderer", () => {
    test("labelExpression prefers the language's name, then the local name", () => {
        expect(labelExpression("local")).toEqual(["get", "name"]);
        expect(labelExpression("ja")).toEqual(["coalesce", ["get", "name:ja"], ["get", "name"]]);
        expect(labelExpression("en")).toEqual(
            ["coalesce", ["get", "name:en"], ["get", "name_en"], ["get", "name:latin"], ["get", "name"]]);
    });

    test("setLanguage rewrites only name labels of the loaded style", () => {
        const set = [];
        const renderer = new VectorMapRenderer(480, 360, () => Promise.resolve(null));
        renderer._map = {
            getStyle: () => ({
                layers: [
                    { id: "water", type: "fill" },
                    { id: "arrow", type: "symbol", layout: { "icon-image": "arrow" } },
                    { id: "shield", type: "symbol", layout: { "text-field": ["to-string", ["get", "ref"]] } },
                    { id: "city", type: "symbol", layout: { "text-field": ["get", "name"] } }
                ]
            }),
            setLayoutProperty: (id, prop, value) => set.push([id, prop, value])
        };
        renderer.setLanguage("ko");
        expect(set).toEqual([["city", "text-field", labelExpression("ko")]]);
    });

    test("render resolves null when MapLibre is unavailable", async () => {
        const renderer = new VectorMapRenderer(480, 360, () => Promise.resolve(null));
        expect(await renderer.render(139.7, 35.6, 14)).toBeNull();
    });
});
