import BlockType from '../../extension-support/block-type';
import ArgumentType from '../../extension-support/argument-type';
import Cast from '../../util/cast';
import translations from './translations.json';
import blockIcon from './block-icon.png';

/**
 * Formatter which is used for translation.
 * This will be replaced which is used in the runtime.
 * @param {object} messageData - format-message object
 * @returns {string} - message for the locale
 */
let formatMessage = messageData => messageData.default;

/**
 * Setup format-message for this extension.
 */
const setupTranslations = () => {
    if (typeof formatMessage.setup !== 'function') return;
    const localeSetup = formatMessage.setup();
    if (localeSetup && localeSetup.translations[localeSetup.locale]) {
        Object.assign(
            localeSetup.translations[localeSetup.locale],
            translations[localeSetup.locale]
        );
    }
};

const EXTENSION_ID = 'map';

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL = 'https://asondemita.github.io/xcx-map/dist/map.mjs';

/**
 * Scratch stage size in stage units (native renderer resolution).
 * @type {number}
 */
const STAGE_WIDTH = 480;
const STAGE_HEIGHT = 360;

/**
 * Size of a map tile in pixels.
 * @type {number}
 */
const TILE_SIZE = 256;

/**
 * Base URL of OpenStreetMap standard raster tiles.
 * These tiles need no API key. Attribution to OpenStreetMap
 * contributors is required by the Tile Usage Policy:
 * https://operations.osmfoundation.org/policies/tiles/
 * @type {string}
 */
const OSM_TILE_BASE = 'https://tile.openstreetmap.org';

/**
 * Limit of the Web Mercator projection in degrees.
 * @type {number}
 */
const MERCATOR_MAX_LAT = 85.05112878;

const MIN_ZOOM = 0;
const MAX_ZOOM = 19;

/**
 * Scratch 3.0 blocks which draw maps using OpenStreetMap raster tiles.
 */
class ExtensionBlocks {
    /**
     * A translation object which is used in this class.
     * @param {FormatObject} formatter - translation object
     */
    static set formatMessage (formatter) {
        formatMessage = formatter;
        if (formatMessage) setupTranslations();
    }

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return formatMessage({
            id: 'map.name',
            default: '地図 (Map)',
            description: 'name of the extension'
        });
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return EXTENSION_ID;
    }

    /**
     * URL to get this extension.
     * @type {string}
     */
    static get extensionURL () {
        return extensionURL;
    }

    /**
     * Set URL to get this extension.
     * The extensionURL will be changed to the URL of the loading server.
     * @param {string} url - URL
     */
    static set extensionURL (url) {
        extensionURL = url;
    }

    /**
     * Construct a set of blocks for the map extension.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        if (runtime.formatMessage) {
            // Replace 'formatMessage' to a formatter which is used in the runtime.
            formatMessage = runtime.formatMessage;
        }

        // Map state. Default to Tokyo Station.
        this.centerLat = 35.681236;
        this.centerLng = 139.767125;
        this.zoom = 13;

        // Points collected for "fit map to all points".
        this._points = [];

        // Result of "get current location".
        this.currentLat = '';
        this.currentLng = '';

        // Renderer objects (created lazily on first map display).
        this._skinId = null;
        this._drawableId = null;
        this._canvas = null;
        this._ctx = null;

        // Cache of tile load promises keyed by URL.
        this._tileCache = new Map();

        // Token to discard results from out-of-date redraws.
        this._redrawToken = 0;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        setupTranslations();
        return {
            id: ExtensionBlocks.EXTENSION_ID,
            name: ExtensionBlocks.EXTENSION_NAME,
            extensionURL: ExtensionBlocks.extensionURL,
            blockIconURI: blockIcon,
            showStatusButton: false,
            blocks: [
                {
                    opcode: 'showMapAt',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.showMapAt',
                        default: '緯度 [LAT] 経度 [LNG] ズーム [ZOOM] の地図を表示する',
                        description: 'display a map at the given location'
                    }),
                    arguments: {
                        LAT: {type: ArgumentType.NUMBER, defaultValue: 35.681236},
                        LNG: {type: ArgumentType.NUMBER, defaultValue: 139.767125},
                        ZOOM: {type: ArgumentType.NUMBER, defaultValue: 13}
                    }
                },
                {
                    opcode: 'setCenter',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.setCenter',
                        default: '緯度 [LAT] 経度 [LNG] に地図を動かす',
                        description: 'move the map center'
                    }),
                    arguments: {
                        LAT: {type: ArgumentType.NUMBER, defaultValue: 35.681236},
                        LNG: {type: ArgumentType.NUMBER, defaultValue: 139.767125}
                    }
                },
                {
                    opcode: 'setZoom',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.setZoom',
                        default: 'ズームを [ZOOM] にする',
                        description: 'set the zoom level'
                    }),
                    arguments: {
                        ZOOM: {type: ArgumentType.NUMBER, defaultValue: 13}
                    }
                },
                {
                    opcode: 'changeZoom',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.changeZoom',
                        default: 'ズームを [ZOOM] ずつ変える',
                        description: 'change the zoom level by the given amount'
                    }),
                    arguments: {
                        ZOOM: {type: ArgumentType.NUMBER, defaultValue: 1}
                    }
                },
                {
                    opcode: 'clearPoints',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.clearPoints',
                        default: '地点をすべて消す',
                        description: 'clear all collected points'
                    })
                },
                {
                    opcode: 'addPoint',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.addPoint',
                        default: '地点 緯度 [LAT] 経度 [LNG] を追加する',
                        description: 'add a point to fit'
                    }),
                    arguments: {
                        LAT: {type: ArgumentType.NUMBER, defaultValue: 35.681236},
                        LNG: {type: ArgumentType.NUMBER, defaultValue: 139.767125}
                    }
                },
                {
                    opcode: 'fitToPoints',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.fitToPoints',
                        default: 'すべての地点が見えるように地図を合わせる',
                        description: 'move and zoom the map so all points are visible'
                    })
                },
                '---',
                {
                    opcode: 'mapLat',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'map.mapLat',
                        default: '地図の中心の緯度',
                        description: 'latitude of the map center'
                    })
                },
                {
                    opcode: 'mapLng',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'map.mapLng',
                        default: '地図の中心の経度',
                        description: 'longitude of the map center'
                    })
                },
                {
                    opcode: 'mapZoom',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'map.mapZoom',
                        default: '地図のズーム',
                        description: 'current zoom level of the map'
                    })
                },
                '---',
                {
                    opcode: 'lngToX',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'map.lngToX',
                        default: '経度 [LNG] の x座標',
                        description: 'x position on the stage for a longitude'
                    }),
                    arguments: {
                        LNG: {type: ArgumentType.NUMBER, defaultValue: 139.767125}
                    }
                },
                {
                    opcode: 'latToY',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'map.latToY',
                        default: '緯度 [LAT] の y座標',
                        description: 'y position on the stage for a latitude'
                    }),
                    arguments: {
                        LAT: {type: ArgumentType.NUMBER, defaultValue: 35.681236}
                    }
                },
                {
                    opcode: 'xToLng',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'map.xToLng',
                        default: 'x座標 [X] の経度',
                        description: 'longitude at an x position on the stage'
                    }),
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0}
                    }
                },
                {
                    opcode: 'yToLat',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'map.yToLat',
                        default: 'y座標 [Y] の緯度',
                        description: 'latitude at a y position on the stage'
                    }),
                    arguments: {
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0}
                    }
                },
                '---',
                {
                    opcode: 'getCurrentLocation',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.getCurrentLocation',
                        default: '現在地を取得する',
                        description: 'get the current location of the device'
                    })
                },
                {
                    opcode: 'currentLatReporter',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'map.currentLat',
                        default: '現在地の緯度',
                        description: 'latitude of the current location'
                    })
                },
                {
                    opcode: 'currentLngReporter',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'map.currentLng',
                        default: '現在地の経度',
                        description: 'longitude of the current location'
                    })
                },
                {
                    opcode: 'distance',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'map.distance',
                        default: '緯度 [LAT1] 経度 [LNG1] から 緯度 [LAT2] 経度 [LNG2] までの距離(km)',
                        description: 'distance between two points in kilometers'
                    }),
                    arguments: {
                        LAT1: {type: ArgumentType.NUMBER, defaultValue: 35.681236},
                        LNG1: {type: ArgumentType.NUMBER, defaultValue: 139.767125},
                        LAT2: {type: ArgumentType.NUMBER, defaultValue: 34.702485},
                        LNG2: {type: ArgumentType.NUMBER, defaultValue: 135.495951}
                    }
                }
            ]
        };
    }

    // ---- Web Mercator helpers ----

    /**
     * @param {number} zoom - integer zoom level.
     * @returns {number} - the size of the whole world in pixels at the zoom.
     */
    _worldSize (zoom) {
        return TILE_SIZE * Math.pow(2, zoom);
    }

    /**
     * @param {number} lng - longitude in degrees.
     * @param {number} zoom - integer zoom level.
     * @returns {number} - world pixel x.
     */
    _lngToWorldX (lng, zoom) {
        return ((lng + 180) / 360) * this._worldSize(zoom);
    }

    /**
     * @param {number} lat - latitude in degrees.
     * @param {number} zoom - integer zoom level.
     * @returns {number} - world pixel y.
     */
    _latToWorldY (lat, zoom) {
        const clamped = Math.min(Math.max(lat, -MERCATOR_MAX_LAT), MERCATOR_MAX_LAT);
        const rad = clamped * Math.PI / 180;
        const y = (1 - (Math.log(Math.tan(rad) + (1 / Math.cos(rad))) / Math.PI)) / 2;
        return y * this._worldSize(zoom);
    }

    /**
     * @param {number} worldX - world pixel x.
     * @param {number} zoom - integer zoom level.
     * @returns {number} - longitude in degrees.
     */
    _worldXToLng (worldX, zoom) {
        return ((worldX / this._worldSize(zoom)) * 360) - 180;
    }

    /**
     * @param {number} worldY - world pixel y.
     * @param {number} zoom - integer zoom level.
     * @returns {number} - latitude in degrees.
     */
    _worldYToLat (worldY, zoom) {
        const n = Math.PI * (1 - (2 * worldY / this._worldSize(zoom)));
        return Math.atan(Math.sinh(n)) * 180 / Math.PI;
    }

    /**
     * Clamp a zoom value to the supported integer range.
     * @param {number} zoom - requested zoom.
     * @returns {number} - clamped integer zoom.
     */
    _clampZoom (zoom) {
        return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.round(zoom)));
    }

    // ---- Rendering ----

    /**
     * Create the renderer skin and drawable for the map if needed.
     * @returns {boolean} - whether the skin is available.
     */
    _ensureSkin () {
        if (this._skinId !== null) return true;
        const renderer = this.runtime && this.runtime.renderer;
        if (!renderer || typeof document === 'undefined') return false;
        const canvas = document.createElement('canvas');
        canvas.width = STAGE_WIDTH;
        canvas.height = STAGE_HEIGHT;
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');
        this._skinId = renderer.createBitmapSkin(canvas, 1);
        // The 'background' layer group is drawn behind every sprite.
        this._drawableId = renderer.createDrawable('background');
        renderer.updateDrawableSkinId(this._drawableId, this._skinId);
        return true;
    }

    /**
     * Load a tile image, caching the load promise.
     * @param {string} url - tile URL.
     * @returns {Promise} - resolves to an HTMLImageElement or null on error.
     */
    _loadTile (url) {
        if (this._tileCache.has(url)) {
            return this._tileCache.get(url);
        }
        const promise = new Promise(resolve => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = url;
        });
        this._tileCache.set(url, promise);
        return promise;
    }

    /**
     * Draw the OpenStreetMap attribution required by the Tile Usage Policy.
     * @param {CanvasRenderingContext2D} ctx - drawing context.
     */
    _drawAttribution (ctx) {
        const label = '© OpenStreetMap contributors';
        ctx.font = '10px sans-serif';
        const padding = 3;
        const width = ctx.measureText(label).width + (padding * 2);
        const height = 14;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(STAGE_WIDTH - width, STAGE_HEIGHT - height, width, height);
        ctx.fillStyle = '#333333';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, STAGE_WIDTH - width + padding, STAGE_HEIGHT - (height / 2));
    }

    /**
     * Redraw the whole map onto the skin from the current state.
     * @returns {Promise} - resolves when the redraw is complete.
     */
    _redraw () {
        if (!this._ensureSkin()) return Promise.resolve();
        const token = ++this._redrawToken;
        const zoom = this.zoom;
        const n = Math.pow(2, zoom);
        const centerWorldX = this._lngToWorldX(this.centerLng, zoom);
        const centerWorldY = this._latToWorldY(this.centerLat, zoom);
        const left = centerWorldX - (STAGE_WIDTH / 2);
        const top = centerWorldY - (STAGE_HEIGHT / 2);

        const txMin = Math.floor(left / TILE_SIZE);
        const txMax = Math.floor((left + STAGE_WIDTH) / TILE_SIZE);
        const tyMin = Math.floor(top / TILE_SIZE);
        const tyMax = Math.floor((top + STAGE_HEIGHT) / TILE_SIZE);

        const jobs = [];
        for (let tx = txMin; tx <= txMax; tx++) {
            for (let ty = tyMin; ty <= tyMax; ty++) {
                if (ty < 0 || ty >= n) continue;
                const wrappedX = ((tx % n) + n) % n;
                // OSM standard tiles have a single layer (no map-type path
                // segment). The map-type block/menu are kept for block
                // compatibility but always resolve to OSM standard tiles.
                const url = `${OSM_TILE_BASE}/${zoom}/${wrappedX}/${ty}.png`;
                const dx = Math.round((tx * TILE_SIZE) - left);
                const dy = Math.round((ty * TILE_SIZE) - top);
                jobs.push(this._loadTile(url).then(img => ({img, dx, dy})));
            }
        }

        return Promise.all(jobs).then(tiles => {
            // Ignore if a newer redraw started while tiles were loading.
            if (token !== this._redrawToken) return;
            const ctx = this._ctx;
            ctx.fillStyle = '#e8e8e8';
            ctx.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
            for (const tile of tiles) {
                if (tile.img) ctx.drawImage(tile.img, tile.dx, tile.dy);
            }
            this._drawAttribution(ctx);
            this.runtime.renderer.updateBitmapSkin(this._skinId, this._canvas, 1);
            this.runtime.requestRedraw();
        });
    }

    // ---- Blocks: display / move / zoom ----

    showMapAt (args) {
        this.centerLat = Cast.toNumber(args.LAT);
        this.centerLng = Cast.toNumber(args.LNG);
        this.zoom = this._clampZoom(Cast.toNumber(args.ZOOM));
        return this._redraw();
    }

    setCenter (args) {
        this.centerLat = Cast.toNumber(args.LAT);
        this.centerLng = Cast.toNumber(args.LNG);
        return this._redraw();
    }

    setZoom (args) {
        this.zoom = this._clampZoom(Cast.toNumber(args.ZOOM));
        return this._redraw();
    }

    changeZoom (args) {
        this.zoom = this._clampZoom(this.zoom + Cast.toNumber(args.ZOOM));
        return this._redraw();
    }

    // ---- Blocks: fit to points ----

    clearPoints () {
        this._points = [];
    }

    addPoint (args) {
        this._points.push({
            lat: Cast.toNumber(args.LAT),
            lng: Cast.toNumber(args.LNG)
        });
    }

    /**
     * Move and zoom the map so that every collected point is visible.
     * Picks the largest integer zoom at which the points' bounding box
     * fits inside the stage (minus a small margin), then centers on it.
     * @returns {Promise|undefined} - resolves when the redraw is complete.
     */
    fitToPoints () {
        if (this._points.length === 0) return;
        if (this._points.length === 1) {
            this.centerLat = this._points[0].lat;
            this.centerLng = this._points[0].lng;
            this.zoom = this._clampZoom(Math.min(MAX_ZOOM, 15));
            return this._redraw();
        }
        // Leave a margin so points are not drawn on the very edge.
        const PADDING = 24;
        const usableWidth = STAGE_WIDTH - (PADDING * 2);
        const usableHeight = STAGE_HEIGHT - (PADDING * 2);
        const bounds = zoom => {
            let minX = Infinity;
            let maxX = -Infinity;
            let minY = Infinity;
            let maxY = -Infinity;
            for (const p of this._points) {
                const wx = this._lngToWorldX(p.lng, zoom);
                const wy = this._latToWorldY(p.lat, zoom);
                if (wx < minX) minX = wx;
                if (wx > maxX) maxX = wx;
                if (wy < minY) minY = wy;
                if (wy > maxY) maxY = wy;
            }
            return {minX, maxX, minY, maxY};
        };
        // Search from the closest zoom outward for the first that fits.
        let fitZoom = MIN_ZOOM;
        for (let z = MAX_ZOOM; z >= MIN_ZOOM; z--) {
            const b = bounds(z);
            if ((b.maxX - b.minX) <= usableWidth && (b.maxY - b.minY) <= usableHeight) {
                fitZoom = z;
                break;
            }
        }
        const b = bounds(fitZoom);
        this.centerLng = this._worldXToLng((b.minX + b.maxX) / 2, fitZoom);
        this.centerLat = this._worldYToLat((b.minY + b.maxY) / 2, fitZoom);
        this.zoom = fitZoom;
        return this._redraw();
    }

    // ---- Blocks: map state reporters ----

    mapLat () {
        return this.centerLat;
    }

    mapLng () {
        return this.centerLng;
    }

    mapZoom () {
        return this.zoom;
    }

    // ---- Blocks: coordinate conversion ----

    lngToX (args) {
        const lng = Cast.toNumber(args.LNG);
        const centerWorldX = this._lngToWorldX(this.centerLng, this.zoom);
        return Math.round(this._lngToWorldX(lng, this.zoom) - centerWorldX);
    }

    latToY (args) {
        const lat = Cast.toNumber(args.LAT);
        const centerWorldY = this._latToWorldY(this.centerLat, this.zoom);
        return Math.round(centerWorldY - this._latToWorldY(lat, this.zoom));
    }

    xToLng (args) {
        const x = Cast.toNumber(args.X);
        const centerWorldX = this._lngToWorldX(this.centerLng, this.zoom);
        return this._worldXToLng(centerWorldX + x, this.zoom);
    }

    yToLat (args) {
        const y = Cast.toNumber(args.Y);
        const centerWorldY = this._latToWorldY(this.centerLat, this.zoom);
        return this._worldYToLat(centerWorldY - y, this.zoom);
    }

    // ---- Blocks: current location / distance ----

    getCurrentLocation () {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            return;
        }
        return new Promise(resolve => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.currentLat = position.coords.latitude;
                    this.currentLng = position.coords.longitude;
                    resolve();
                },
                () => resolve(),
                {enableHighAccuracy: true, timeout: 10000, maximumAge: 0}
            );
        });
    }

    currentLatReporter () {
        return this.currentLat;
    }

    currentLngReporter () {
        return this.currentLng;
    }

    distance (args) {
        const lat1 = Cast.toNumber(args.LAT1);
        const lng1 = Cast.toNumber(args.LNG1);
        const lat2 = Cast.toNumber(args.LAT2);
        const lng2 = Cast.toNumber(args.LNG2);
        const earthRadiusKm = 6371;
        const toRad = deg => deg * Math.PI / 180;
        const dLat = toRad(lat2 - lat1);
        const dLng = toRad(lng2 - lng1);
        const a = (Math.sin(dLat / 2) * Math.sin(dLat / 2)) +
            (Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2));
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(earthRadiusKm * c * 1000) / 1000;
    }
}

export {ExtensionBlocks as default, ExtensionBlocks as blockClass};
