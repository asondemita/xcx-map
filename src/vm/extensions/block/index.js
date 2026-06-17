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
 * Raster tile sources selectable from the "map type" block. None need an
 * API key. GSI (国土地理院) tiles cover Japan only; OSM standard covers the
 * whole world. Each requires attribution per its usage policy.
 * @type {object}
 */
const TILE_TYPES = {
    pale: {
        base: 'https://cyberjapandata.gsi.go.jp/xyz/pale',
        maxZoom: 18,
        attribution: '地理院タイル (国土地理院)'
    },
    osm: {
        base: 'https://tile.openstreetmap.org',
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }
};
const DEFAULT_TILE_TYPE = 'osm';

/**
 * Limit of the Web Mercator projection in degrees.
 * @type {number}
 */
const MERCATOR_MAX_LAT = 85.05112878;

const MIN_ZOOM = 0;

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
            default: '地図',
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

        // Selected raster tile source (key of TILE_TYPES).
        this._mapType = DEFAULT_TILE_TYPE;

        // Points collected for "fit map to all points".
        this._points = [];

        // Whether pins show their order number (1, 2, 3, ...).
        this._pinNumbered = false;

        // Map layer transparency (ghost effect: 0 = opaque, 100 = invisible).
        this._opacity = 0;

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
                    opcode: 'showCurrentLocation',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.showCurrentLocation',
                        default: '現在位置の地図を表示する',
                        description: 'center the map on the current location'
                    })
                },
                {
                    opcode: 'showMapByKeyword',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.showMapByKeyword',
                        default: '[KEYWORD] の地図を表示する',
                        description: 'search a place name and show its map'
                    }),
                    arguments: {
                        KEYWORD: {type: ArgumentType.STRING, defaultValue: '東京タワー'}
                    }
                },
                {
                    opcode: 'showPinMap',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.showPinMap',
                        default: 'ピン番号 [NUMBER] の地図を表示する',
                        description: 'center the map on a pin'
                    }),
                    arguments: {
                        NUMBER: {type: ArgumentType.NUMBER, defaultValue: 1}
                    }
                },
                {
                    opcode: 'showMapAt',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.showMapAt',
                        default: '緯度 [LAT] 経度 [LNG] の地図を表示する',
                        description: 'display a map at the given location'
                    }),
                    arguments: {
                        LAT: {type: ArgumentType.NUMBER, defaultValue: 35.681236},
                        LNG: {type: ArgumentType.NUMBER, defaultValue: 139.767125}
                    }
                },
                '---',
                {
                    opcode: 'addCenterPin',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.addCenterPin',
                        default: '地図の中心に [COLOR] 色のピンを立てる',
                        description: 'drop a pin at the map center'
                    }),
                    arguments: {
                        COLOR: {
                            type: ArgumentType.STRING,
                            menu: 'pinColorMenu',
                            defaultValue: '#e53935'
                        }
                    }
                },
                {
                    opcode: 'plotData',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.plotData',
                        default: 'データ [DATA] のピンを立てる',
                        description: 'plot pasted CSV/TSV rows (lat, lng, name, color)'
                    }),
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: '35.68,139.76,東京,赤'}
                    }
                },
                {
                    opcode: 'setLastPinName',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.setLastPinName',
                        default: '直前のピンの名前を [NAME] にする',
                        description: "set the most recent pin's name"
                    }),
                    arguments: {
                        NAME: {type: ArgumentType.STRING, defaultValue: 'ココ'}
                    }
                },
                {
                    opcode: 'setPinName',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.setPinName',
                        default: 'ピン番号 [NUMBER] の名前を [NAME] にする',
                        description: "set a pin's name shown on the map"
                    }),
                    arguments: {
                        NUMBER: {type: ArgumentType.NUMBER, defaultValue: 1},
                        NAME: {type: ArgumentType.STRING, defaultValue: 'ココ'}
                    }
                },
                {
                    opcode: 'setPinNumber',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.setPinNumber',
                        default: 'ピン番号を表示 [MODE]',
                        description: 'show or hide pin order numbers'
                    }),
                    arguments: {
                        MODE: {
                            type: ArgumentType.STRING,
                            menu: 'pinNumberMenu',
                            defaultValue: 'off'
                        }
                    }
                },
                {
                    opcode: 'removePin',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.removePin',
                        default: 'ピン番号 [NUMBER] を消す',
                        description: 'remove the pin with the given number'
                    }),
                    arguments: {
                        NUMBER: {type: ArgumentType.NUMBER, defaultValue: 1}
                    }
                },
                {
                    opcode: 'clearPoints',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.clearPoints',
                        default: '全てのピンを消す',
                        description: 'clear all pins'
                    })
                },
                '---',
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
                    opcode: 'fitToPoints',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.fitToPoints',
                        default: '全てのピンが見えるよう調整する',
                        description: 'move and zoom the map so all pins are visible'
                    })
                },
                {
                    opcode: 'panHorizontal',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.panHorizontal',
                        default: '地図を横に [PIXELS] ピクセル移動する',
                        description: 'pan the map horizontally by pixels'
                    }),
                    arguments: {
                        PIXELS: {type: ArgumentType.NUMBER, defaultValue: 50}
                    }
                },
                {
                    opcode: 'panVertical',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.panVertical',
                        default: '地図を縦に [PIXELS] ピクセル移動する',
                        description: 'pan the map vertically by pixels'
                    }),
                    arguments: {
                        PIXELS: {type: ArgumentType.NUMBER, defaultValue: 50}
                    }
                },
                {
                    opcode: 'moveByDistance',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.moveByDistance',
                        default: '地図上で [DEGREES] 度方向に [DISTANCE] m を [SECONDS] 秒で移動する',
                        description: 'glide the map center by a real-world distance along a compass bearing'
                    }),
                    arguments: {
                        DEGREES: {type: ArgumentType.ANGLE, defaultValue: 90},
                        DISTANCE: {type: ArgumentType.NUMBER, defaultValue: 100},
                        SECONDS: {type: ArgumentType.NUMBER, defaultValue: 1}
                    }
                },
                {
                    opcode: 'scrollBetweenPins',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.scrollBetweenPins',
                        default: 'ピン番号 [FROM] からピン番号 [TO] へスクロールする',
                        description: 'scroll the map from one pin to another'
                    }),
                    arguments: {
                        FROM: {type: ArgumentType.NUMBER, defaultValue: 1},
                        TO: {type: ArgumentType.NUMBER, defaultValue: 2}
                    }
                },
                '---',
                {
                    opcode: 'mapLat',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'map.mapLat',
                        default: '中心の緯度',
                        description: 'latitude of the map center'
                    })
                },
                {
                    opcode: 'mapLng',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'map.mapLng',
                        default: '中心の経度',
                        description: 'longitude of the map center'
                    })
                },
                {
                    opcode: 'pinDistance',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'map.pinDistance',
                        default: 'ピン番号 [FROM] からピン番号 [TO] までの距離(km)',
                        description: 'distance between two pins in kilometers'
                    }),
                    arguments: {
                        FROM: {type: ArgumentType.NUMBER, defaultValue: 1},
                        TO: {type: ArgumentType.NUMBER, defaultValue: 2}
                    }
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
                },
                '---',
                {
                    opcode: 'setMapType',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.setMapType',
                        default: '地図の種類を [TYPE] にする',
                        description: 'set the tile type'
                    }),
                    arguments: {
                        TYPE: {
                            type: ArgumentType.STRING,
                            menu: 'mapTypeMenu',
                            defaultValue: 'osm'
                        }
                    }
                },
                {
                    opcode: 'setOpacity',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'map.setOpacity',
                        default: '地図の透明度を [OPACITY] にする',
                        description: 'set the map layer transparency'
                    }),
                    arguments: {
                        OPACITY: {type: ArgumentType.NUMBER, defaultValue: 50}
                    }
                }
            ],
            menus: {
                pinColorMenu: {
                    acceptReporters: false,
                    items: 'getPinColorMenu'
                },
                mapTypeMenu: {
                    acceptReporters: false,
                    items: 'getMapTypeMenu'
                },
                pinNumberMenu: {
                    acceptReporters: false,
                    items: 'getPinNumberMenu'
                }
            }
        };
    }

    /**
     * @returns {Array} - items for the pin number on/off menu.
     */
    getPinNumberMenu () {
        return [
            {
                text: formatMessage({id: 'map.pinNumber.on', default: 'する', description: 'show pin numbers'}),
                value: 'on'
            },
            {
                text: formatMessage({id: 'map.pinNumber.off', default: 'しない', description: 'hide pin numbers'}),
                value: 'off'
            }
        ];
    }

    /**
     * @returns {Array} - items for the map type menu (label + tile key).
     */
    getMapTypeMenu () {
        return [
            {
                text: formatMessage({id: 'map.mapType.osm', default: '標準', description: 'OSM standard map'}),
                value: 'osm'
            },
            {
                text: formatMessage({id: 'map.mapType.pale', default: '淡色', description: 'GSI pale map'}),
                value: 'pale'
            }
        ];
    }

    /**
     * @returns {Array} - items for the pin color menu (label + hex value).
     */
    getPinColorMenu () {
        const colors = [
            {id: 'map.color.red', default: '赤', value: '#e53935'},
            {id: 'map.color.yellow', default: '黄', value: '#fdd835'},
            {id: 'map.color.blue', default: '青', value: '#1e88e5'},
            {id: 'map.color.green', default: '緑', value: '#43a047'},
            {id: 'map.color.orange', default: '橙', value: '#fb8c00'},
            {id: 'map.color.purple', default: '紫', value: '#8e24aa'},
            {id: 'map.color.brown', default: '茶', value: '#6d4c41'},
            {id: 'map.color.black', default: '黒', value: '#000000'}
        ];
        return colors.map(c => ({
            text: formatMessage({id: c.id, default: c.default, description: 'pin color name'}),
            value: c.value
        }));
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
     * @returns {object} - config of the currently selected tile type.
     */
    _tileConfig () {
        return TILE_TYPES[this._mapType] || TILE_TYPES[DEFAULT_TILE_TYPE];
    }

    /**
     * @returns {number} - max integer zoom for the current tile type.
     */
    _maxZoom () {
        return this._tileConfig().maxZoom;
    }

    /**
     * Clamp a zoom value to the supported integer range.
     * @param {number} zoom - requested zoom.
     * @returns {number} - clamped integer zoom.
     */
    _clampZoom (zoom) {
        return Math.max(MIN_ZOOM, Math.min(this._maxZoom(), Math.round(zoom)));
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
        renderer.updateDrawableEffect(this._drawableId, 'ghost', this._opacity);
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
     * Draw the attribution required by the current tile source's policy.
     * @param {CanvasRenderingContext2D} ctx - drawing context.
     */
    _drawAttribution (ctx) {
        const label = this._tileConfig().attribution;
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
     * Draw a teardrop pin whose tip points at the given stage position.
     * @param {CanvasRenderingContext2D} ctx - drawing context.
     * @param {number} x - stage x of the pin tip.
     * @param {number} y - stage y of the pin tip.
     * @param {string} color - fill color of the pin head.
     * @param {?string} label - order number to draw on the head, or null.
     * @param {?string} name - pin name shown in a bubble, or empty/undefined.
     */
    _drawPin (ctx, x, y, color, label, name) {
        const headR = 6;
        const headCy = y - 15;
        // Left/right where the tail meets the head.
        const tailX = headR * 0.8;
        const tailY = headCy + (headR * 0.55);
        ctx.save();
        ctx.lineJoin = 'round';
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillStyle = color || '#e53935';
        // Tail (filled, no top chord so it blends into the head).
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - tailX, tailY);
        ctx.lineTo(x + tailX, tailY);
        ctx.closePath();
        ctx.fill();
        // Head.
        ctx.beginPath();
        ctx.arc(x, headCy, headR, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Outline only the two visible tail edges (tip up to the head).
        ctx.beginPath();
        ctx.moveTo(x - tailX, tailY);
        ctx.lineTo(x, y);
        ctx.lineTo(x + tailX, tailY);
        ctx.stroke();
        if (label) {
            // Order number, white with a dark outline so it reads on any color.
            ctx.font = `bold ${label.length > 1 ? 8 : 10}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillStyle = '#ffffff';
            ctx.strokeText(label, x, headCy);
            ctx.fillText(label, x, headCy);
        } else {
            // White center dot.
            ctx.beginPath();
            ctx.arc(x, headCy, headR * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        }
        ctx.restore();
        if (name) {
            this._drawBubble(ctx, x, headCy - headR, y, name);
        }
    }

    /**
     * Draw a small speech bubble anchored to a pin.
     * @param {CanvasRenderingContext2D} ctx - drawing context.
     * @param {number} x - pin x (bubble points here).
     * @param {number} topAnchor - y just above the pin head (bubble above).
     * @param {number} bottomAnchor - y at the pin tip (bubble below if no room).
     * @param {string} text - bubble text.
     */
    _drawBubble (ctx, x, topAnchor, bottomAnchor, text) {
        ctx.save();
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const tail = 4;
        const bw = Math.ceil(ctx.measureText(text).width + 8);
        const bh = 14;
        let bx = x - (bw / 2);
        bx = Math.max(2, Math.min(STAGE_WIDTH - bw - 2, bx));
        const above = (topAnchor - tail - bh) >= 2;
        const by = above ? (topAnchor - tail - bh) : (bottomAnchor + tail);
        const tx = Math.max(bx + 4, Math.min((bx + bw) - 4, x));
        const baseY = above ? (by + bh) : by;
        const tipY = above ? (by + bh + tail) : (by - tail);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeRect(bx, by, bw, bh);
        // Tail: filled white (hides the box edge at its mouth), then outline.
        ctx.beginPath();
        ctx.moveTo(tx - 3, baseY);
        ctx.lineTo(tx + 3, baseY);
        ctx.lineTo(tx, tipY);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(tx - 3, baseY);
        ctx.lineTo(tx, tipY);
        ctx.lineTo(tx + 3, baseY);
        ctx.stroke();
        ctx.fillStyle = '#222222';
        ctx.fillText(text, bx + (bw / 2), by + (bh / 2));
        ctx.restore();
    }

    /**
     * Draw a pin for every collected point that falls near the stage.
     * @param {CanvasRenderingContext2D} ctx - drawing context.
     * @param {number} zoom - current integer zoom.
     * @param {number} left - world x of the stage's left edge.
     * @param {number} top - world y of the stage's top edge.
     */
    _drawMarkers (ctx, zoom, left, top) {
        for (let i = 0; i < this._points.length; i++) {
            const p = this._points[i];
            const px = Math.round(this._lngToWorldX(p.lng, zoom) - left);
            const py = Math.round(this._latToWorldY(p.lat, zoom) - top);
            // Skip pins whose tip is well outside the stage.
            if (px < -20 || px > STAGE_WIDTH + 20 || py < -20 || py > STAGE_HEIGHT + 20) {
                continue;
            }
            const label = this._pinNumbered ? String(i + 1) : null;
            this._drawPin(ctx, px, py, p.color, label, p.name);
        }
    }

    /**
     * Redraw the whole map onto the skin from the current state.
     * Supports a fractional render zoom by scaling tiles, so animations
     * (e.g. the pin scroll) zoom smoothly rather than stepping integers.
     * @param {number} [renderZoom] - fractional zoom to render at; defaults
     *   to the integer this.zoom.
     * @returns {Promise} - resolves when the redraw is complete.
     */
    _redraw (renderZoom = this.zoom) {
        if (!this._ensureSkin()) return Promise.resolve();
        const token = ++this._redrawToken;
        const tileBase = this._tileConfig().base;
        const zoom = renderZoom;
        // Integer tile zoom for tile URLs; remaining fraction becomes a scale.
        const tileZoom = Math.max(MIN_ZOOM, Math.min(this._maxZoom(), Math.floor(zoom)));
        const tilePx = TILE_SIZE * Math.pow(2, zoom - tileZoom);
        const n = Math.pow(2, tileZoom);
        // Stage edges in render-zoom world pixels.
        const left = this._lngToWorldX(this.centerLng, zoom) - (STAGE_WIDTH / 2);
        const top = this._latToWorldY(this.centerLat, zoom) - (STAGE_HEIGHT / 2);

        const txMin = Math.floor(left / tilePx);
        const txMax = Math.floor((left + STAGE_WIDTH) / tilePx);
        const tyMin = Math.floor(top / tilePx);
        const tyMax = Math.floor((top + STAGE_HEIGHT) / tilePx);

        const jobs = [];
        for (let tx = txMin; tx <= txMax; tx++) {
            for (let ty = tyMin; ty <= tyMax; ty++) {
                if (ty < 0 || ty >= n) continue;
                const wrappedX = ((tx % n) + n) % n;
                const url = `${tileBase}/${tileZoom}/${wrappedX}/${ty}.png`;
                const dx = (tx * tilePx) - left;
                const dy = (ty * tilePx) - top;
                jobs.push(this._loadTile(url).then(img => ({img, dx, dy})));
            }
        }
        // Draw size is rounded up with a 1px overlap to avoid seams.
        const drawPx = Math.ceil(tilePx) + 1;

        return Promise.all(jobs).then(tiles => {
            // Ignore if a newer redraw started while tiles were loading.
            if (token !== this._redrawToken) return;
            const ctx = this._ctx;
            ctx.fillStyle = '#e8e8e8';
            ctx.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
            for (const tile of tiles) {
                if (tile.img) {
                    ctx.drawImage(tile.img, Math.floor(tile.dx), Math.floor(tile.dy), drawPx, drawPx);
                }
            }
            this._drawMarkers(ctx, zoom, left, top);
            this._drawAttribution(ctx);
            this.runtime.renderer.updateBitmapSkin(this._skinId, this._canvas, 1);
            this.runtime.requestRedraw();
        });
    }

    // ---- Blocks: display / move / zoom ----

    showMapAt (args) {
        this.centerLat = Cast.toNumber(args.LAT);
        this.centerLng = Cast.toNumber(args.LNG);
        return this._redraw();
    }

    // Center the map on pin NUMBER (1-based); keeps the current zoom.
    showPinMap (args) {
        const pin = this._points[Cast.toNumber(args.NUMBER) - 1];
        if (!pin) {
            return;
        }
        this.centerLat = pin.lat;
        this.centerLng = pin.lng;
        return this._redraw();
    }

    /**
     * Geocode a free keyword with OpenStreetMap Nominatim and show its map,
     * fitting the result's bounding box. Subject to the Nominatim usage
     * policy (max ~1 request/second, no bulk use).
     * @param {object} args - block arguments.
     * @returns {Promise|undefined} - resolves when the map has been redrawn.
     */
    showMapByKeyword (args) {
        const keyword = Cast.toString(args.KEYWORD).trim();
        if (keyword === '' || typeof fetch === 'undefined') {
            return;
        }
        const url = 'https://nominatim.openstreetmap.org/search' +
            `?q=${encodeURIComponent(keyword)}&format=json&limit=1&accept-language=ja`;
        return fetch(url, {headers: {Accept: 'application/json'}})
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) {
                    return;
                }
                const result = data[0];
                const box = result.boundingbox; // [south, north, west, east]
                if (box && box.length === 4) {
                    this._fitToBounds(
                        Number(box[0]), Number(box[1]), Number(box[2]), Number(box[3])
                    );
                } else {
                    this.centerLat = Number(result.lat);
                    this.centerLng = Number(result.lon);
                    this.zoom = this._clampZoom(15);
                }
                return this._redraw();
            })
            .catch(() => {});
    }

    setMapType (args) {
        const type = Cast.toString(args.TYPE);
        if (TILE_TYPES[type]) {
            this._mapType = type;
        }
        // Re-clamp in case the new tile type has a lower max zoom.
        this.zoom = this._clampZoom(this.zoom);
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

    // Positive PIXELS moves the map center east (right).
    panHorizontal (args) {
        const dx = Cast.toNumber(args.PIXELS);
        const worldX = this._lngToWorldX(this.centerLng, this.zoom) + dx;
        this.centerLng = this._worldXToLng(worldX, this.zoom);
        return this._redraw();
    }

    // Positive PIXELS moves the map center north (up).
    panVertical (args) {
        const dy = Cast.toNumber(args.PIXELS);
        const worldY = this._latToWorldY(this.centerLat, this.zoom) - dy;
        this.centerLat = this._worldYToLat(worldY, this.zoom);
        return this._redraw();
    }

    /**
     * Spherical "destination point": the lat/lng reached by travelling
     * DISTANCE meters from a start point along a compass bearing (0 = north,
     * 90 = east, clockwise).
     * @param {number} lat - start latitude in degrees.
     * @param {number} lng - start longitude in degrees.
     * @param {number} bearingDeg - bearing in degrees.
     * @param {number} distanceM - distance in meters.
     * @returns {object} - {lat, lng} of the destination in degrees.
     */
    _destinationPoint (lat, lng, bearingDeg, distanceM) {
        const earthRadiusM = 6371000;
        const toRad = deg => deg * Math.PI / 180;
        const lat1 = toRad(lat);
        const lng1 = toRad(lng);
        const bearing = toRad(bearingDeg);
        const delta = distanceM / earthRadiusM;
        const lat2 = Math.asin(
            (Math.sin(lat1) * Math.cos(delta)) +
            (Math.cos(lat1) * Math.sin(delta) * Math.cos(bearing))
        );
        const lng2 = lng1 + Math.atan2(
            Math.sin(bearing) * Math.sin(delta) * Math.cos(lat1),
            Math.cos(delta) - (Math.sin(lat1) * Math.sin(lat2))
        );
        return {
            lat: lat2 * 180 / Math.PI,
            // Normalize longitude back into [-180, 180].
            lng: ((((lng2 * 180 / Math.PI) + 540) % 360) - 180)
        };
    }

    /**
     * Move the map center DISTANCE meters along a compass bearing (0 = north,
     * 90 = east, clockwise; matches Scratch's direction dial), gliding there
     * over SECONDS seconds. With SECONDS <= 0 it jumps instantly.
     * @param {object} args - block arguments (DEGREES, DISTANCE, SECONDS).
     * @returns {Promise} - resolves when the move/animation finishes.
     */
    moveByDistance (args) {
        const bearing = Cast.toNumber(args.DEGREES);
        const distance = Cast.toNumber(args.DISTANCE);
        const seconds = Cast.toNumber(args.SECONDS);
        const startLat = this.centerLat;
        const startLng = this.centerLng;
        if (!(seconds > 0)) {
            const dest = this._destinationPoint(startLat, startLng, bearing, distance);
            this.centerLat = dest.lat;
            this.centerLng = dest.lng;
            return this._redraw();
        }
        // Glide by advancing the travelled distance along the bearing so the
        // center stays exactly on the path the whole way.
        const totalMs = seconds * 1000;
        const startTime = Date.now();
        const animate = () => {
            const t = Math.min(1, (Date.now() - startTime) / totalMs);
            const dest = this._destinationPoint(startLat, startLng, bearing, distance * t);
            this.centerLat = dest.lat;
            this.centerLng = dest.lng;
            return Promise.resolve(this._redraw()).then(() => {
                if (t >= 1) return;
                return new Promise(resolve => setTimeout(resolve, 24)).then(animate);
            });
        };
        return animate();
    }

    // Transparency 0 = opaque, 100 = fully transparent (Scratch ghost effect).
    setOpacity (args) {
        this._opacity = Math.max(0, Math.min(100, Cast.toNumber(args.OPACITY)));
        if (!this._ensureSkin()) return;
        this.runtime.renderer.updateDrawableEffect(this._drawableId, 'ghost', this._opacity);
        this.runtime.requestRedraw();
    }

    mapLat () {
        return this.centerLat;
    }

    mapLng () {
        return this.centerLng;
    }

    // ---- Blocks: fit to points ----

    clearPoints () {
        this._points = [];
        return this._redraw();
    }

    removePin (args) {
        const i = Cast.toNumber(args.NUMBER) - 1;
        if (i >= 0 && i < this._points.length) {
            this._points.splice(i, 1);
        }
        return this._redraw();
    }

    setPinNumber (args) {
        this._pinNumbered = Cast.toString(args.MODE) === 'on';
        return this._redraw();
    }

    addCenterPin (args) {
        this._points.push({
            lat: this.centerLat,
            lng: this.centerLng,
            color: Cast.toString(args.COLOR)
        });
        return this._redraw();
    }

    // A short name (max 6 chars then "..."; empty becomes '').
    _truncateName (raw) {
        const chars = Array.from(Cast.toString(raw));
        return chars.length > 6 ? `${chars.slice(0, 6).join('')}...` : chars.join('');
    }

    // Map a color name (赤/あか/red/… or a #rrggbb) to a hex string.
    _colorNameToHex (name) {
        const raw = Cast.toString(name).trim();
        if (/^#[0-9a-f]{6}$/i.test(raw)) {
            return raw;
        }
        const key = raw.toLowerCase();
        const groups = [
            ['#e53935', ['赤', 'あか', 'red']],
            ['#fdd835', ['黄', '黄色', 'きいろ', 'yellow']],
            ['#1e88e5', ['青', 'あお', 'blue']],
            ['#43a047', ['緑', 'みどり', 'green']],
            ['#fb8c00', ['橙', 'だいだい', 'オレンジ', 'orange']],
            ['#8e24aa', ['紫', 'むらさき', 'purple']],
            ['#6d4c41', ['茶', '茶色', 'ちゃ', 'ちゃいろ', 'brown']],
            ['#000000', ['黒', 'くろ', 'black']]
        ];
        for (const group of groups) {
            if (group[1].indexOf(raw) >= 0 || group[1].indexOf(key) >= 0) {
                return group[0];
            }
        }
        return '#e53935';
    }

    /**
     * Parse pasted spreadsheet data (lat, lng, name?, color?) into records.
     * Handles the common paste outcomes: real newlines kept, or newlines
     * turned into spaces while tab/comma columns survive. Rule: if there are
     * newlines, rows split on newline/';'. Otherwise, when tab/comma columns
     * are present, the former newlines are spaces, so rows split on spaces and
     * columns on tab/comma. With no separators at all, the whole text is one
     * space-separated row. Rows whose first two fields aren't numbers (e.g. a
     * header) are skipped.
     * @param {string} raw - pasted text.
     * @returns {Array} - [{lat, lng, name, color}].
     */
    _plotParse (raw) {
        const text = Cast.toString(raw)
            .replace(/\r\n?/g, '\n')
            .trim();
        const isNum = s => s !== '' && isFinite(Number(s));
        const hasRowBreak = (/[\n;]/).test(text);
        const hasFieldSep = (/[\t,]/).test(text);
        let rowSep;
        let colSep;
        if (hasRowBreak) {
            rowSep = /[\n;]+/;
            colSep = hasFieldSep ? /[\t,]/ : /\s+/;
        } else if (hasFieldSep) {
            // Newlines became spaces; tabs/commas still delimit the columns.
            rowSep = / +/;
            colSep = /[\t,]/;
        } else {
            rowSep = /\n/; // no break available: treat as a single row
            colSep = /\s+/;
        }
        const recs = [];
        for (const row of text.split(rowSep)) {
            const f = row.split(colSep).map(s => s.trim());
            if (f.length >= 2 && isNum(f[0]) && isNum(f[1])) {
                recs.push({
                    lat: Number(f[0]),
                    lng: Number(f[1]),
                    name: (f[2] || '').trim(),
                    color: (f[3] || '').trim()
                });
            }
        }
        return recs;
    }

    plotData (args) {
        for (const r of this._plotParse(args.DATA)) {
            const pin = {lat: r.lat, lng: r.lng, color: this._colorNameToHex(r.color)};
            const name = this._truncateName(r.name);
            if (name) {
                pin.name = name;
            }
            this._points.push(pin);
        }
        return this._redraw();
    }

    // Set a pin's name shown on the map (max 6 chars + …; empty clears).
    _applyPinName (point, raw) {
        if (!point) {
            return;
        }
        point.name = this._truncateName(raw);
    }

    setLastPinName (args) {
        this._applyPinName(this._points[this._points.length - 1], args.NAME);
        return this._redraw();
    }

    setPinName (args) {
        this._applyPinName(this._points[Cast.toNumber(args.NUMBER) - 1], args.NAME);
        return this._redraw();
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
            this.zoom = this._clampZoom(Math.min(this._maxZoom(), 15));
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
        for (let z = this._maxZoom(); z >= MIN_ZOOM; z--) {
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

    /**
     * Largest integer zoom at which a lat/lng box fits the stage (with margin).
     * @param {number} south - southern latitude.
     * @param {number} north - northern latitude.
     * @param {number} west - western longitude.
     * @param {number} east - eastern longitude.
     * @returns {number} - fitting integer zoom.
     */
    _fitZoomForBounds (south, north, west, east) {
        const PADDING = 24;
        const usableWidth = STAGE_WIDTH - (PADDING * 2);
        const usableHeight = STAGE_HEIGHT - (PADDING * 2);
        for (let z = this._maxZoom(); z >= MIN_ZOOM; z--) {
            const w = Math.abs(this._lngToWorldX(east, z) - this._lngToWorldX(west, z));
            const h = Math.abs(this._latToWorldY(south, z) - this._latToWorldY(north, z));
            if (w <= usableWidth && h <= usableHeight) {
                return z;
            }
        }
        return MIN_ZOOM;
    }

    /**
     * Center and zoom the map to fit a lat/lng bounding box.
     * @param {number} south - southern latitude.
     * @param {number} north - northern latitude.
     * @param {number} west - western longitude.
     * @param {number} east - eastern longitude.
     */
    _fitToBounds (south, north, west, east) {
        const fitZoom = this._fitZoomForBounds(south, north, west, east);
        const cx = (this._lngToWorldX(west, fitZoom) + this._lngToWorldX(east, fitZoom)) / 2;
        const cy = (this._latToWorldY(north, fitZoom) + this._latToWorldY(south, fitZoom)) / 2;
        this.centerLng = this._worldXToLng(cx, fitZoom);
        this.centerLat = this._worldYToLat(cy, fitZoom);
        this.zoom = fitZoom;
    }

    // ---- Blocks: current location / distance ----

    /**
     * Get the device's current location and center the map on it.
     * @returns {Promise|undefined} - resolves when the map has been redrawn.
     */
    showCurrentLocation () {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            return;
        }
        return new Promise(resolve => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.centerLat = position.coords.latitude;
                    this.centerLng = position.coords.longitude;
                    Promise.resolve(this._redraw()).then(resolve);
                },
                () => resolve(),
                {enableHighAccuracy: true, timeout: 10000, maximumAge: 0}
            );
        });
    }

    /**
     * Great-circle distance between two points in kilometers (haversine).
     * @param {number} lat1 - latitude of point 1.
     * @param {number} lng1 - longitude of point 1.
     * @param {number} lat2 - latitude of point 2.
     * @param {number} lng2 - longitude of point 2.
     * @returns {number} - distance in km, rounded to 3 decimals.
     */
    _haversineKm (lat1, lng1, lat2, lng2) {
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

    distance (args) {
        return this._haversineKm(
            Cast.toNumber(args.LAT1), Cast.toNumber(args.LNG1),
            Cast.toNumber(args.LAT2), Cast.toNumber(args.LNG2)
        );
    }

    /**
     * @param {object} args - block arguments with 1-based FROM/TO pin numbers.
     * @returns {number|string} - km between the two pins, or '' if invalid.
     */
    pinDistance (args) {
        const from = this._points[Cast.toNumber(args.FROM) - 1];
        const to = this._points[Cast.toNumber(args.TO) - 1];
        if (!from || !to) {
            return '';
        }
        return this._haversineKm(from.lat, from.lng, to.lat, to.lng);
    }

    /**
     * van Wijk & Nuij (2003) "Smooth and efficient zooming and panning":
     * builds the optimal zoom/pan path between two viewports. Returns a
     * function t in [0,1] -> {x, y, w} (center world px and viewport width).
     * @param {number} ux0 - start center world x.
     * @param {number} uy0 - start center world y.
     * @param {number} w0 - start viewport width (world px).
     * @param {number} ux1 - end center world x.
     * @param {number} uy1 - end center world y.
     * @param {number} w1 - end viewport width (world px).
     * @returns {Function} - interpolator t -> {x, y, w}.
     */
    _smoothZoomPath (ux0, uy0, w0, ux1, uy1, w1) {
        const rho = Math.SQRT2;
        const rho2 = rho * rho;
        const rho4 = rho2 * rho2;
        const cosh = x => (Math.exp(x) + Math.exp(-x)) / 2;
        const sinh = x => (Math.exp(x) - Math.exp(-x)) / 2;
        const tanh = x => {
            const e = Math.exp(2 * x);
            return (e - 1) / (e + 1);
        };
        const dx = ux1 - ux0;
        const dy = uy1 - uy0;
        const d2 = (dx * dx) + (dy * dy);
        if (d2 < 1e-9) {
            // Same point: just interpolate the zoom exponentially.
            const sameS = Math.log(w1 / w0) / rho;
            return t => ({x: ux0 + (t * dx), y: uy0 + (t * dy), w: w0 * Math.exp(rho * t * sameS)});
        }
        const d1 = Math.sqrt(d2);
        const b0 = (((w1 * w1) - (w0 * w0)) + (rho4 * d2)) / (2 * w0 * rho2 * d1);
        const b1 = (((w1 * w1) - (w0 * w0)) - (rho4 * d2)) / (2 * w1 * rho2 * d1);
        const r0 = Math.log(Math.sqrt((b0 * b0) + 1) - b0);
        const r1 = Math.log(Math.sqrt((b1 * b1) + 1) - b1);
        const S = (r1 - r0) / rho;
        const coshr0 = cosh(r0);
        const path = t => {
            const s = (t * S) + (r0 / rho);
            const u = (w0 / (rho2 * d1)) * ((coshr0 * tanh(rho * s)) - sinh(r0));
            return {x: ux0 + (u * dx), y: uy0 + (u * dy), w: (w0 * coshr0) / cosh(rho * s)};
        };
        path.S = S;
        return path;
    }

    /**
     * Scroll the map from one pin to another with a van Wijk & Nuij smooth
     * zoom/pan path: it zooms out, glides across, and zooms back in with a
     * constant perceived velocity. Keeps the start zoom.
     * @param {object} args - block arguments with 1-based FROM/TO pin numbers.
     * @returns {Promise|undefined} - resolves when the scroll finishes.
     */
    scrollBetweenPins (args) {
        const from = this._points[Cast.toNumber(args.FROM) - 1];
        const to = this._points[Cast.toNumber(args.TO) - 1];
        if (!from || !to) {
            return;
        }
        const startZoom = this.zoom;
        const maxZoom = this._maxZoom();
        // Work in world pixels at the start zoom; the viewport is STAGE_WIDTH
        // wide at both ends, so the path zooms out only as far as needed.
        const path = this._smoothZoomPath(
            this._lngToWorldX(from.lng, startZoom), this._latToWorldY(from.lat, startZoom), STAGE_WIDTH,
            this._lngToWorldX(to.lng, startZoom), this._latToWorldY(to.lat, startZoom), STAGE_WIDTH
        );
        const steps = 180;
        const delayMs = 24;
        const frame = t => {
            const p = path(t);
            this.centerLng = this._worldXToLng(p.x, startZoom);
            this.centerLat = this._worldYToLat(p.y, startZoom);
            // w = STAGE_WIDTH * 2^(startZoom - z)  ->  z = startZoom - log2(w/STAGE_WIDTH)
            const z = startZoom - (Math.log(p.w / STAGE_WIDTH) / Math.LN2);
            return Promise.resolve(this._redraw(Math.max(MIN_ZOOM, Math.min(maxZoom, z))));
        };
        const animate = i => frame(i / steps).then(() => {
            if (i >= steps) {
                this.zoom = startZoom;
                return;
            }
            return new Promise(resolve => setTimeout(resolve, delayMs))
                .then(() => animate(i + 1));
        });
        return animate(0);
    }
}

export {ExtensionBlocks as default, ExtensionBlocks as blockClass};
