/**
 * Off-screen vector map used when the map labels must be shown in a chosen
 * language. Raster OSM tiles have their labels baked in the local language,
 * so a language switch renders OpenFreeMap vector tiles with MapLibre GL
 * instead and copies the result onto the extension's own canvas.
 *
 * MapLibre GL is large (~1 MB), so it is loaded from a CDN only the first
 * time a vector map is needed, and never bundled into the extension.
 */

/**
 * MapLibre GL ES module on a CDN (version pinned).
 * @type {string}
 */
export const MAPLIBRE_URL = 'https://cdn.jsdelivr.net/npm/maplibre-gl@6.19.0/dist/maplibre-gl.mjs';

/**
 * OpenFreeMap style (no API key; OpenMapTiles schema with name:xx tags).
 * @type {string}
 */
export const VECTOR_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

/**
 * Attribution required by OpenFreeMap / OpenMapTiles / OpenStreetMap.
 * @type {string}
 */
export const VECTOR_ATTRIBUTION = 'OpenFreeMap © OpenMapTiles © OpenStreetMap contributors';

/**
 * Longest time to wait for the map to finish loading its tiles before the
 * frame is used as it is.
 * @type {number}
 */
const RENDER_TIMEOUT_MS = 10000;

let maplibrePromise = null;

/**
 * Load MapLibre GL once and share it.
 * @returns {Promise<object|null>} - the maplibregl module, or null on failure.
 */
const loadMaplibre = function () {
    if (!maplibrePromise) {
        const url = MAPLIBRE_URL;
        maplibrePromise = import(/* webpackIgnore: true */ url)
            .then(module => module.default || module)
            .catch(() => {
                // Let a later call retry (e.g. after a network hiccup).
                maplibrePromise = null;
                return null;
            });
    }
    return maplibrePromise;
};

/**
 * MapLibre expression for a label in the given language, falling back to
 * the local name. 'local' uses the local name only.
 * @param {string} lang - language code ('ja', 'en', ...) or 'local'.
 * @returns {Array} - MapLibre expression.
 */
export const labelExpression = function (lang) {
    if (lang === 'local') return ['get', 'name'];
    const expr = ['coalesce', ['get', `name:${lang}`]];
    if (lang === 'en') {
        expr.push(['get', 'name_en'], ['get', 'name:latin']);
    }
    expr.push(['get', 'name']);
    return expr;
};

/**
 * Whether a style layer draws a name label (as opposed to road shield
 * numbers or one-way arrows).
 * @param {object} layer - style layer.
 * @returns {boolean} - true for name labels.
 */
const isNameLabel = function (layer) {
    if (layer.type !== 'symbol' || !layer.layout) return false;
    const field = layer.layout['text-field'];
    if (!field) return false;
    return JSON.stringify(field).includes('name');
};

export class VectorMapRenderer {
    /**
     * @param {number} width - output width in pixels.
     * @param {number} height - output height in pixels.
     * @param {function} [loader] - returns a Promise of the maplibregl module
     *   (replaceable for tests).
     */
    constructor (width, height, loader = loadMaplibre) {
        this.width = width;
        this.height = height;
        this._loader = loader;
        this._language = 'local';
        this._map = null;
        this._mapPromise = null;
    }

    /**
     * Create the off-screen map once MapLibre is available.
     * @returns {Promise<object|null>} - the maplibre Map, or null on failure.
     */
    _ensureMap () {
        if (this._mapPromise) return this._mapPromise;
        if (typeof document === 'undefined') return Promise.resolve(null);
        this._mapPromise = this._loader().then(maplibregl => {
            if (!maplibregl || !maplibregl.Map) {
                this._mapPromise = null;
                return null;
            }
            const container = document.createElement('div');
            container.style.cssText = 'position:fixed;left:-10000px;top:0;' +
                `width:${this.width}px;height:${this.height}px;pointer-events:none;`;
            document.body.appendChild(container);
            let map;
            try {
                map = new maplibregl.Map({
                    container,
                    style: VECTOR_STYLE_URL,
                    interactive: false,
                    attributionControl: false,
                    preserveDrawingBuffer: true,
                    pixelRatio: 1,
                    fadeDuration: 0,
                    center: [0, 0],
                    zoom: 0
                });
            } catch (e) {
                // WebGL unavailable.
                container.remove();
                return null;
            }
            this._map = map;
            return new Promise(resolve => {
                const ready = () => {
                    this._applyLanguage();
                    resolve(map);
                };
                if (map.isStyleLoaded && map.isStyleLoaded()) {
                    ready();
                } else {
                    map.once('load', ready);
                    map.once('error', () => resolve(map));
                }
            });
        });
        return this._mapPromise;
    }

    /**
     * Set the label language.
     * @param {string} lang - language code or 'local'.
     */
    setLanguage (lang) {
        if (lang === this._language) return;
        this._language = lang;
        this._applyLanguage();
    }

    /**
     * Point every name label of the loaded style at the current language.
     */
    _applyLanguage () {
        const map = this._map;
        if (!map || !map.getStyle) return;
        const style = map.getStyle();
        if (!style || !Array.isArray(style.layers)) return;
        const expr = labelExpression(this._language);
        for (const layer of style.layers) {
            if (isNameLabel(layer)) {
                map.setLayoutProperty(layer.id, 'text-field', expr);
            }
        }
    }

    /**
     * Render the map at a view and hand back its canvas.
     * @param {number} lng - center longitude.
     * @param {number} lat - center latitude.
     * @param {number} zoom - zoom in 256 px tile units (as the raster tiles);
     *   MapLibre counts 512 px tiles, so one level is subtracted.
     * @returns {Promise<HTMLCanvasElement|null>} - rendered canvas, or null
     *   when the vector map is unavailable.
     */
    render (lng, lat, zoom) {
        return this._ensureMap().then(map => {
            if (!map) return null;
            map.jumpTo({center: [lng, lat], zoom: Math.max(0, zoom - 1), bearing: 0, pitch: 0});
            // Draw now: when the view's tiles are already loaded (as in most
            // frames of an animation) the frame is ready without waiting for
            // the next animation frame.
            if (typeof map.redraw === 'function') {
                map.redraw();
                if (map.areTilesLoaded()) return map.getCanvas();
            }
            return new Promise(resolve => {
                let done = false;
                let timer = null;
                let onRender = null;
                const finish = () => {
                    if (done) return;
                    done = true;
                    clearTimeout(timer);
                    map.off('render', onRender);
                    map.off('idle', finish);
                    resolve(map.getCanvas());
                };
                // A frame drawn with every visible tile loaded is final;
                // waiting for 'idle' as well would slow animations down.
                onRender = () => {
                    if (map.areTilesLoaded()) finish();
                };
                timer = setTimeout(finish, RENDER_TIMEOUT_MS);
                map.on('render', onRender);
                map.once('idle', finish);
                map.triggerRepaint();
            });
        });
    }
}
