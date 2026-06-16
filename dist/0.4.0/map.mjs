var img$2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAF0CAIAAABwgtBbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAFJhJREFUeNrs3Q1slPd9wPGAX4LlwzXUDa6SFGeYbpHWmGbaOokszlqtSaU1SEunaZOIm7TKpHbBCuuLIhqq0EUIbW1HaKQJNStup1YtQSpNpYG2RZjgTUELtamqNOGyHE0JdpqAY59rgk2yf3BrHttgP+d7v/t8ZCED5/OTx8bf/J57/s+z5KlfpK8CgGq11C4AQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBIE9q7QKgMNIT6cee2zU0PmhXzHJX21+uX3WL/SCEQIXbfLQ7OZK0H+ZKjia/u/L7ibqEXVEUDo0CBflZP5JUwXlm5YEz/faDEAKVbGwybSfMPxTaCUIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIgBACgBACgBACgBACgBACgBACgBACgBACgBACgBACgBACgBACgBACgBACgBACgBACgBACgBACgBACgBACgBACQCmqtQuALA2c6V/wMcmRpB2FEAKVJuRt89Hu9ETarqB8OTQKLJ4KIoRAVVNBhBAAhBAAhBAAhBAAhBAAhBAAhBAAhBAAhBCAeay/5hY7oVhcaxSgmBJ1ic/eeH97U7tdIYQAl3z9Qzur4T9zVUNra0OrL7cQAszWsXKdnUBheI0QACEEACEEACEEACEEACEEACEEACEEACEEACEEmCFPlwdb57IyCCFQFrbd/EjOoxXi+pkb77dvKZglT/0ibS8AWRo403+lv3LVUIQQAEqXQ6MAVDW3YQLKQ9/QkQOn/n1sItZBrMa6RHvT2nUr1zkwy4IcGgXKo4IPHduyiA/8+od2aiHzc2gUKAP7UnsX94FHhp629xBCoHq9OJK0ExBCABBCALgcZ40CWUmOJAfO9Kcn060NrYu44tqa5e2JuoTdiBACZWnH8e0HTx3I5hlCBb9y8yNO7KSIHBoFFqlv6EiWFQzSE+knFntGKAghUEzJ0dyckDnPdUpBCIHKl55wWQ+EEACEEKhObsOLEAKAEAKAEAKAEAJA4biyDGTyD2bpkkTdjP99HH7zgt2Spf4z/TuObw/vDI0PJkeT7cvbp/+qsS4xdSfeXK1ZBCGEzLLXfPXS5fU14ddlNUuX1S650iPTE2+dm3w7/PqrX0+GX+26TEWvUNNvfT1CCEXvX0tDzXsaasOvMT8kjImJuqvC49ua6ibfevu18QunxyYNiyCEUGbCzHd9oq61sTa0MJuOhmcIb2FGfGnk/ODYpB0LQghlMAVev7wuzHO5zeqNK6++oaleDkEIoaS1NNSEYl1pChzr7U339o4d6r0wPDw+MDD3AYnOzrq2toaOjsbbOsOvl83hextrT5w97+VDEEIouUFwbXN9a+Nl/iGc7fn2G/v3j+zfv+CThExe1dt79uL7Nc3NTRs2rOy6u7GzM/qY5qtrPnjNshPDRkMoOdYRUr3CrBbiNKuCYewb2rbtZ+9uefnee+NUcJbw4Wd7el788EdO3PwHIaWzohtGw/Bmz4MQQvEl6pb+4aqGWYsCQ7p+vqZ96OFtoWdZPv/4wEBI6f99+COzjqaG7ob6ZnMyDiCEkIMKzqpRKF+IVkhX9gmMSvf2htEwjJjRP5w6TOqrAEIIxRH6N6uCYWgLg+A7L/XlRxgxQ2WjiQ0ldowUhBCKY1YFR/bvn1WpfAiVnfVZWhtrb3hXvS8HCCEU1Nrm+ujrgmO9vam/uCvfFZyeO2e1sK2prvnqGl8UEEIokFCd65bXRcsUKljIDZjbwnnWLwJCCDkWfVku1OhkoWbBWS18ZfPfT/92We2SG3J6ORtACOHyWhtro7ePGNq27XwqVZQtOdvTE12hGIbUee5rAQgh5MYNTZfOTBnr7X1t56NF3JgwFEaH0ei2kVvpybSdgBDCnHHw4W3ZPFvjrbdOvS36GcIw+tqjj15p88ih5EgyerNDmMu1RqkK10fOkZm6iHamz9B058fDW4hf3erV0T+fOHly7PDhs9/+t/BrRk8YRtKWTZtqmpt/s4WJuhPD532l8mHH8e3pifRdbZ+wKzARUqUu3jV36aLHwRUbN/7uCz9/394fNG/cOKuCQfiT8Oc3/MfB8JbRjHhheDg6FLY0+L/SPHrsuV0PHdsyOD5oVyCEVKP3Ri6rfT51Mv44WNP8rpC3a7+5e27/5goVDA9+7z/9Y/wNi16Ve1ntEmsK86pv6MjmZ7rDaGhXIIRUneZllwLz2qM7Y37Uso6b2o8+k+kLge++/++u++bumA8+n0pFL8n9ngYhzK8wEW4+qoUIIVUmTFozLiVzKNY4GGbB1Xt/EGcQvEx3N26M38KzPT2XDTZ5khxJ3tf3qfCrXYEQUjXjYOR44/nUycveYn6u9y22gtMtDKNhnEdGwxyC7SozBZsL+4aO2BUIIVVh+cwri8b5kBUbN2azNGLKNV/6UhgrF3xYCHN0QWHz1f5JFkJ6Iv3QsS37Uk/YFQghlS9RvzRSnf5YDXtoS/afN1QwtDDOI89FhtTl9Y6OFs5jz+3acXy7/YAQUuGih0bP9S98XLTpzo9nc1B0xqfeuDHWdNI74+ioL1khHTx1QAvxr44qEucFwhDCXH26MBTGebbzqZPT79f6F1mMFnq9UAihKsbBqy6uYV/wQ7J/dTDTZ5uIXPvbRFgU+1J77QQhhMoXHbzmkavjolOWddy04GOieXbWKAgh5MvEydSCj6nPaQVjirmiAxBCyLu6YoQQEEIoFZneQQIQQmA+F4bfsBNACKF6h8Jzx48v+JjpWxICQgh5tKyjI87DRn70ZA4/6ciPfrTgYxribRgghJCxybfeznTwGs1dCM8NHA9vGX1IeuItXzUQQsiZWV2JM3udP3ly+Dvfyclnf33XN+I8rPG2zsuWGxBCyMVYNnkpLXVtbXE+5NWvPJL9SS5jhw+fjRfU+tWXtip93kQIQgh5Gwob1sV6NS4MhYOf+3w2nzR09NSn74v54GWRrRp1aLQYOt79QTtBCKEqQpjo7Iz5UWGYi3lg87IVfOmjHw01jfPgmubm6AFbEyEUXq1dQGU7e+5CW1Pd1PuNnZ0hPHEuvR2c/tznL7zxxjVfyuzehFMVjH+OTGPnjBcIY54s05PcM/D6T+Yfce5a/YlEXcI3AAgh1W74zQuzwjOyf3/Mj331K/8w1nv4um/ujnnptbHDh099+r6Ys+CUd23YENnUWBV87LldC95avf9Mf3pi9LM33u8bABbk0CiV77XxC5cNT8y2Pf/+3wvT4cS8eQsPe+nPbg9vGVUwaNpw5/T7vxqfjPMhB08dyOHDABMhlS8EpqWhZjo88Y+OTnt91zfC27KOmxpvvbWh46bpAXHs8NMTqZOhgpn277cbsyG6ujEa7HmkJ9I5fBgghFTXRBjCE/JztqdnEc+ziAXy81vZdXd0I8tuEWFy5ITvLiqAQ6NUvhCYwbFLRx1Xbd1aCltV39bWFDlOG/O4aOnYcXx739AR310IIZSH05EQ1retjr+OIn9aNm26UqpLXHoivfmZbq9BIoRQTobfvBA9fXTVl4s8FNY0N6+IHBf9ZbqsKni0u/9Mv28qhBDKeChs7Ows7lDY0r0peprMy6MTZbEPkyPJv+n9q/CrbyeEEMrP4Nhk9LqjRRwKQwKjx0XDhpXFaTIDZ/rDLOhkVIQQythLI+ejQ2GxbgQ4axyMblUc7U3tcR7W2tCaw20+eOrAA8+oIEIIlTUUtnR3FyeEM8fB6CbF0dV+T6yHrb0nVxvck9yz4/h23z9UKusIqbqh8MaVV0+9v6Lr7qFt286nUoXcgBVdXdmMg8H6Vbd897bvD5zpHxwfvNIs2LFyXa4mwpBAJ4gihFBRQ+Ha5vrapUumfrtq69aX7723kBsQXcW4iHFwOnWt196R701NT6S3HtviBFEqnkOjVJ3oWoUwFNbHu1tvrsbB+rZL1+8+XcJrBy2TQAihYr08OhE9S7OQF5qJfq5ZSxtLimUSCCFUslDB6FA4dRnuwo+DL71RomsHLZNACKG6hsJ3VvV1byrAJ41eYrtkx0HLJBBCqJahMHpLipZNm/I9FCY6O6M3oy/NcdAyCYQQqkh03UIBhsLohWzOTb5dguNgSGDPiW/5xkAIoVqEGkVv+BBd5J73cTDztYN55W4SCCEYCqduB9FVmHGwpO64ZJkECCGGwt/mKj/rKOrb2kp2HLRMAoSQajfrhr35GAqjfS2pcdAyCRBCmHPD3lwPhWEcjN6A9+V0qZwsapkECCH8RnQlQ86HwmhZJ98qlXHQMgkQQrjiUBhd9p7bcfCX6ZK4Aa9lEiCEMN9Q2NjZmYic25KN6JKMkMCXR4t8XNQyCRBCuOJQGL0dUnS1w6JdXI9RQuOgZRIghDDvUBhZ1ZCTobCle8Zl24o7DlomAUIIC5h1j9wsr7j2zjXbIsdFw5MXcRwM/bNMAoQQMhsKmzZsyOaGvbPGwSIuoj946sB9fZ9SQRBCyHgozGZN4axxMPq0hbQv9YRlEiCEkEkLf31pnd+KrrsXNxSu6OoqhXEwJPCx53b5moIQQgaiN+xd9FAY/aiijIPpifRDx7ZYJgFCCBkLFfxlOquhMIyD9W2ro2UtfAU3H+3uGzriqwlCCDkYCldkeKGZ6Dg4/OaF9MRbhdz45Ejyvr5PWSYBQgg5GwpbNs04/zOjcTB6wZrCVDDMgoPjg76IkJFau4BZwk/SoWL/MO1YuW7+n/h9r+bx0N+ymiX/cutnpt5/Z0Vg96ahh7fF+cDodUr/91fPf+Nn/1mwPZaeGN2XesJ3Lwgh2Tp46kApnHCfqEvsXv94a0Nrsbbwj1vf98n3//n0UPjazkcvDA8vsM2dndEb8H7+ma8deuVZ31FQ+hwaJTpVpEtk2VnYkn2pvZf9q8LcOeHhZ3dPvz/rqqFXEr1Caf/rL6ggCCHl58XREjrJ4sUrnPFRmNfAUqOv7Hnhx9O/bdnUndE4uPOn3/PtBEII5S06FC54w97oOJgaPb3nhSftQBBCKG9hKDx0+tLhzXkW1zd0dETHwWhBASGEyh8KW7q7jYMghFCBDr3y7IJDYX1bW/RUGuMgCCFU8lA494a9My4lc370h6lDdhoIIVTuUPjlrfOMgzt/+r3QQjsNhBAqSs/zl9ZRNHZ2RofCWePgP1s1AUIIlWfPC0+mRk/PHQprmpubNtxpHAQhhMoXfaUwDIWhhWEuvP5fH5++HrdxEIQQqmko3Lr1d576r6YNG6b/5IepXuMgCCFUsgf+56tX+quQwAf++6t2EQghVLIfpg7dc+jhuX8eJsU/ffJvjYNQvtyGCeLa88KTh04/2/37f72u5f1Tf7I/dWjP8z9WQRBCqBap0VfmOUYKlCOHRgEQQgAQQgAQQgAQQgAQQgAQQgAQQigl7U3tdgIghFSvL3zgwXUr19kPQK64sgzlNxF+7UM7kyPJscl0yW5keiL90LEtvlgghJDHHNoJQE44NAqAEMJFa5YbswAhpIol6hJ2AiCEACCEACCEAFDxLJ+g/KQn0i+OJou+GWuWt3tVtYjam9qTI0n7ASGk6oSffZuPdocWFn1LQgW/9kc7rWgsituvveOO6z72wDPddgXZc2iUMrP12JZSqODUYNqT/JavSOF98aYHw5v9gBCSrx8xJX64b3B8sHQ2ZqiUNqZ6vkXDOGg/kEMOjTJD+BET3gbO9M/9qx3Htw/6uT+T16hUECGkMnVc7vYOrQ2tQogKUnkcGgVUEBMhQKlydi4mQijpn9F2ggoihFC92t2vQwURQgAVRAgBVJBy5WQZoLSE/oUKev0VEyGggiCEgAqCEAIqCEIIqOAMqxpa7TeEEKgEt197x+71j2c6C7Y2tK673EVxFyFXz0OZctYoUOQKLvrmgttufuTgqQN9Q08v+rOvaWq/ZdWfdAihEAK6Uo7CEHlX2yfCm6872XBoFCpK19p77AQQQqjecbDVKSQghGAcBOLzGmGFSI4k+149Mv3bgdd/Mv1+Y12ivWmtccE4CAhhJVdw89Hu9ET6Sg/oG3qnkftSe3evf9zPSuMgEOXQaCUIs+A8FZwWHnPw1IFy/48tqZA3lsxlUIyDIITEnB1PlPt/wrabHymRn/iJukRXe6kMYcZBWDSHRqvLWIzBscS1N7V/97bvD5zpT44k05NX/M9J1CbyfTe70lmFbRwEIaTqhAi5GohxEHLCoVEob8ZBEEIKxMX+S9Md133MTgAhpBC61t6T71fdyNQ6h4gha14jrC5rsihZa0Pr7vWPJ0eSA2f6r7p40so8Dz4y9PS+1BN2eAH+78ROACEkA4m65Vk+Q+hfzLlQCI2DUBYcGiUvwuBY5XugAIeRjYMghJSueVb4VYkvfODB/LUwUZf44k0PGgchJxwahXxNhLvXPz44Pjg0Ppj9szXm//oAIIRA7rU2tFrkByXOoVEAhBAAhBByKFGbsBMAIaR6ObMDEEIAEEIKYv01tyRi3Co9POb2a+8ozCY1Zn1o9HbXkgYKYslTv0jbCxVgcHywb+hI/5mfzL317pqm9kTd8kTtOxWM08tcCduzL7W3/+KFSTPS2tAaKtjV/klfVkAIASC/HBoFQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBQAgBEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAEEIAKIb/F2AAcI1aHvVCY1sAAAAASUVORK5CYII=";

var img$1 = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='UTF-8'%3f%3e%3csvg id='_%e3%83%ac%e3%82%a4%e3%83%a4%e3%83%bc_1' data-name='%e3%83%ac%e3%82%a4%e3%83%a4%e3%83%bc_1' xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 80 80'%3e %3c!-- Generator: Adobe Illustrator 30.2.1%2c SVG Export Plug-In . SVG Version: 2.1.1 Build 1) --%3e %3cdefs%3e %3cstyle%3e .st0 %7b fill: white%3b %7d .st1 %7b fill: %234d4d4d%3b %7d %3c/style%3e %3c/defs%3e %3cpolygon class='st0' points='69.7438 69.5886 10.2562 69.5886 21.7209 45.8599 58.2791 45.8599 69.7438 69.5886'/%3e %3cpath class='st1' d='M70.6377%2c69.1572l-11.4648-23.7285c-.166-.3428-.5127-.5605-.8936-.5605h-12.3213l5.9044-12.3914c2.0986-4.4044%2c2.5488-9.0875%2c1.1409-13.6874-1.8155-5.9315-6.8879-9.3889-13.0379-9.37-5.9226.0181-10.9067%2c3.2297-12.816%2c8.9261-1.5428%2c4.6032-1.227%2c9.4392.8922%2c13.9016l5.9938%2c12.6212h-12.3146c-.3809%2c0-.7275.2178-.8936.5605l-11.4644%2c23.7285c-.1484.3076-.1284.6699.0532.959s.499.4648.8403.4648h59.4878c.3418%2c0%2c.6592-.1758.8408-.4648.1807-.2891.2012-.6514.0527-.959ZM11.8374%2c68.5967l10.5059-21.7441h12.6345l4.3167%2c9.0897c.1678.3534.5742.4346.7836.408.163-.0208.4615-.1104.6004-.4019l4.334-9.0958h12.6448l10.5059%2c21.7441H11.8374Z'/%3e %3cpath class='st0' d='M38.1959%2c16.6437c4.1341-1.0457%2c7.9654%2c1.513%2c8.8764%2c5.4416.8604%2c3.7103-1.483%2c7.6283-5.3028%2c8.5696-3.836.9452-7.7511-1.2814-8.7929-5.2352-.9548-3.6234%2c1.1386-7.7437%2c5.2194-8.776Z'/%3e%3c/svg%3e";

var en$1 = {
	"map.entry.name": "Map",
	"map.entry.description": "Draw maps with OpenStreetMap tiles. No API key, works on any domain."
};
var ja$1 = {
	"map.entry.name": "地図 (Map)",
	"map.entry.description": "OpenStreetMap で地図を描きます。APIキー不要・どのドメインでも使えます。"
};
var translations$1 = {
	en: en$1,
	ja: ja$1,
	"ja-Hira": {
	"map.entry.name": "ちず (Map)",
	"map.entry.description": "オープンストリートマップでちずをかきます。APIキーいらず・どのドメインでもつかえます。"
}
};

var version$1 = "0.4.0";

/**
 * This is an extension for Xcratch.
 */


/**
 * Formatter to translate the messages in this extension.
 * This will be replaced which is used in the React component.
 * @param {object} messageData - data for format-message
 * @returns {string} - translated message for the current locale
 */
var formatMessage$1 = function formatMessage(messageData) {
  return messageData.defaultMessage;
};
var version = "v".concat(version$1);
var entry = {
  get name() {
    return formatMessage$1({
      id: 'map.entry.name',
      defaultMessage: '地図 (Map)',
      description: 'name of the extension'
    });
  },
  extensionId: 'map',
  extensionURL: 'https://asondemita.github.io/xcx-map/dist/map.mjs',
  collaborator: 'asondemita',
  iconURL: img$2,
  insetIconURL: img$1,
  get description() {
    return "".concat(formatMessage$1({
      defaultMessage: 'OpenStreetMap で地図を描きます。APIキー不要・どのドメインでも使えます。',
      description: 'Description for this extension',
      id: 'map.entry.description'
    }), " (").concat(version, ")");
  },
  tags: ['map', 'osm'],
  featured: true,
  disabled: false,
  bluetoothRequired: false,
  internetConnectionRequired: true,
  helpLink: 'https://asondemita.github.io/xcx-map/',
  setFormatMessage: function setFormatMessage(formatter) {
    formatMessage$1 = formatter;
  },
  translationMap: translations$1
};

function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (String )(t);
}

function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}

function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

/**
 * Types of block
 * @enum {string}
 */
var blockType;
var hasRequiredBlockType;
function requireBlockType() {
  if (hasRequiredBlockType) return blockType;
  hasRequiredBlockType = 1;
  var BlockType = {
    /**
     * Boolean reporter with hexagonal shape
     */
    BOOLEAN: 'Boolean',
    /**
     * A button (not an actual block) for some special action, like making a variable
     */
    BUTTON: 'button',
    /**
     * Command block
     */
    COMMAND: 'command',
    /**
     * Specialized command block which may or may not run a child branch
     * The thread continues with the next block whether or not a child branch ran.
     */
    CONDITIONAL: 'conditional',
    /**
     * Specialized hat block with no implementation function
     * This stack only runs if the corresponding event is emitted by other code.
     */
    EVENT: 'event',
    /**
     * Hat block which conditionally starts a block stack
     */
    HAT: 'hat',
    /**
     * Specialized command block which may or may not run a child branch
     * If a child branch runs, the thread evaluates the loop block again.
     */
    LOOP: 'loop',
    /**
     * General reporter with numeric or string value
     */
    REPORTER: 'reporter'
  };
  blockType = BlockType;
  return blockType;
}

var blockTypeExports = requireBlockType();
var BlockType = /*@__PURE__*/getDefaultExportFromCjs(blockTypeExports);

/**
 * Block argument types
 * @enum {string}
 */
var argumentType;
var hasRequiredArgumentType;
function requireArgumentType() {
  if (hasRequiredArgumentType) return argumentType;
  hasRequiredArgumentType = 1;
  var ArgumentType = {
    /**
     * Numeric value with angle picker
     */
    ANGLE: 'angle',
    /**
     * Boolean value with hexagonal placeholder
     */
    BOOLEAN: 'Boolean',
    /**
     * Numeric value with color picker
     */
    COLOR: 'color',
    /**
     * Numeric value with text field
     */
    NUMBER: 'number',
    /**
     * String value with text field
     */
    STRING: 'string',
    /**
     * String value with matrix field
     */
    MATRIX: 'matrix',
    /**
     * MIDI note number with note picker (piano) field
     */
    NOTE: 'note',
    /**
     * Inline image on block (as part of the label)
     */
    IMAGE: 'image'
  };
  argumentType = ArgumentType;
  return argumentType;
}

var argumentTypeExports = requireArgumentType();
var ArgumentType = /*@__PURE__*/getDefaultExportFromCjs(argumentTypeExports);

var color;
var hasRequiredColor;
function requireColor() {
  if (hasRequiredColor) return color;
  hasRequiredColor = 1;
  var Color = /*#__PURE__*/function () {
    function Color() {
      _classCallCheck(this, Color);
    }
    return _createClass(Color, null, [{
      key: "RGB_BLACK",
      get:
      /**
       * @typedef {object} RGBObject - An object representing a color in RGB format.
       * @property {number} r - the red component, in the range [0, 255].
       * @property {number} g - the green component, in the range [0, 255].
       * @property {number} b - the blue component, in the range [0, 255].
       */

      /**
       * @typedef {object} HSVObject - An object representing a color in HSV format.
       * @property {number} h - hue, in the range [0-359).
       * @property {number} s - saturation, in the range [0,1].
       * @property {number} v - value, in the range [0,1].
       */

      /** @type {RGBObject} */
      function get() {
        return {
          r: 0,
          g: 0,
          b: 0
        };
      }

      /** @type {RGBObject} */
    }, {
      key: "RGB_WHITE",
      get: function get() {
        return {
          r: 255,
          g: 255,
          b: 255
        };
      }

      /**
       * Convert a Scratch decimal color to a hex string, #RRGGBB.
       * @param {number} decimal RGB color as a decimal.
       * @return {string} RGB color as #RRGGBB hex string.
       */
    }, {
      key: "decimalToHex",
      value: function decimalToHex(decimal) {
        if (decimal < 0) {
          decimal += 0xFFFFFF + 1;
        }
        var hex = Number(decimal).toString(16);
        hex = "#".concat('000000'.substr(0, 6 - hex.length)).concat(hex);
        return hex;
      }

      /**
       * Convert a Scratch decimal color to an RGB color object.
       * @param {number} decimal RGB color as decimal.
       * @return {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
       */
    }, {
      key: "decimalToRgb",
      value: function decimalToRgb(decimal) {
        var a = decimal >> 24 & 0xFF;
        var r = decimal >> 16 & 0xFF;
        var g = decimal >> 8 & 0xFF;
        var b = decimal & 0xFF;
        return {
          r: r,
          g: g,
          b: b,
          a: a > 0 ? a : 255
        };
      }

      /**
       * Convert a hex color (e.g., F00, #03F, #0033FF) to an RGB color object.
       * CC-BY-SA Tim Down:
       * https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
       * @param {!string} hex Hex representation of the color.
       * @return {RGBObject} null on failure, or rgb: {r: red [0,255], g: green [0,255], b: blue [0,255]}.
       */
    }, {
      key: "hexToRgb",
      value: function hexToRgb(hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
          return r + r + g + g + b + b;
        });
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      }

      /**
       * Convert an RGB color object to a hex color.
       * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
       * @return {!string} Hex representation of the color.
       */
    }, {
      key: "rgbToHex",
      value: function rgbToHex(rgb) {
        return Color.decimalToHex(Color.rgbToDecimal(rgb));
      }

      /**
       * Convert an RGB color object to a Scratch decimal color.
       * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
       * @return {!number} Number representing the color.
       */
    }, {
      key: "rgbToDecimal",
      value: function rgbToDecimal(rgb) {
        return (rgb.r << 16) + (rgb.g << 8) + rgb.b;
      }

      /**
      * Convert a hex color (e.g., F00, #03F, #0033FF) to a decimal color number.
      * @param {!string} hex Hex representation of the color.
      * @return {!number} Number representing the color.
      */
    }, {
      key: "hexToDecimal",
      value: function hexToDecimal(hex) {
        return Color.rgbToDecimal(Color.hexToRgb(hex));
      }

      /**
       * Convert an HSV color to RGB format.
       * @param {HSVObject} hsv - {h: hue [0,360), s: saturation [0,1], v: value [0,1]}
       * @return {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
       */
    }, {
      key: "hsvToRgb",
      value: function hsvToRgb(hsv) {
        var h = hsv.h % 360;
        if (h < 0) h += 360;
        var s = Math.max(0, Math.min(hsv.s, 1));
        var v = Math.max(0, Math.min(hsv.v, 1));
        var i = Math.floor(h / 60);
        var f = h / 60 - i;
        var p = v * (1 - s);
        var q = v * (1 - s * f);
        var t = v * (1 - s * (1 - f));
        var r;
        var g;
        var b;
        switch (i) {
          default:
          case 0:
            r = v;
            g = t;
            b = p;
            break;
          case 1:
            r = q;
            g = v;
            b = p;
            break;
          case 2:
            r = p;
            g = v;
            b = t;
            break;
          case 3:
            r = p;
            g = q;
            b = v;
            break;
          case 4:
            r = t;
            g = p;
            b = v;
            break;
          case 5:
            r = v;
            g = p;
            b = q;
            break;
        }
        return {
          r: Math.floor(r * 255),
          g: Math.floor(g * 255),
          b: Math.floor(b * 255)
        };
      }

      /**
       * Convert an RGB color to HSV format.
       * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
       * @return {HSVObject} hsv - {h: hue [0,360), s: saturation [0,1], v: value [0,1]}
       */
    }, {
      key: "rgbToHsv",
      value: function rgbToHsv(rgb) {
        var r = rgb.r / 255;
        var g = rgb.g / 255;
        var b = rgb.b / 255;
        var x = Math.min(Math.min(r, g), b);
        var v = Math.max(Math.max(r, g), b);

        // For grays, hue will be arbitrarily reported as zero. Otherwise, calculate
        var h = 0;
        var s = 0;
        if (x !== v) {
          var f = r === x ? g - b : g === x ? b - r : r - g;
          var i = r === x ? 3 : g === x ? 5 : 1;
          h = (i - f / (v - x)) * 60 % 360;
          s = (v - x) / v;
        }
        return {
          h: h,
          s: s,
          v: v
        };
      }

      /**
       * Linear interpolation between rgb0 and rgb1.
       * @param {RGBObject} rgb0 - the color corresponding to fraction1 <= 0.
       * @param {RGBObject} rgb1 - the color corresponding to fraction1 >= 1.
       * @param {number} fraction1 - the interpolation parameter. If this is 0.5, for example, mix the two colors equally.
       * @return {RGBObject} the interpolated color.
       */
    }, {
      key: "mixRgb",
      value: function mixRgb(rgb0, rgb1, fraction1) {
        if (fraction1 <= 0) return rgb0;
        if (fraction1 >= 1) return rgb1;
        var fraction0 = 1 - fraction1;
        return {
          r: fraction0 * rgb0.r + fraction1 * rgb1.r,
          g: fraction0 * rgb0.g + fraction1 * rgb1.g,
          b: fraction0 * rgb0.b + fraction1 * rgb1.b
        };
      }
    }]);
  }();
  color = Color;
  return color;
}

var cast;
var hasRequiredCast;
function requireCast() {
  if (hasRequiredCast) return cast;
  hasRequiredCast = 1;
  var Color = requireColor();

  /**
   * @fileoverview
   * Utilities for casting and comparing Scratch data-types.
   * Scratch behaves slightly differently from JavaScript in many respects,
   * and these differences should be encapsulated below.
   * For example, in Scratch, add(1, join("hello", world")) -> 1.
   * This is because "hello world" is cast to 0.
   * In JavaScript, 1 + Number("hello" + "world") would give you NaN.
   * Use when coercing a value before computation.
   */
  var Cast = /*#__PURE__*/function () {
    function Cast() {
      _classCallCheck(this, Cast);
    }
    return _createClass(Cast, null, [{
      key: "toNumber",
      value:
      /**
       * Scratch cast to number.
       * Treats NaN as 0.
       * In Scratch 2.0, this is captured by `interp.numArg.`
       * @param {*} value Value to cast to number.
       * @return {number} The Scratch-casted number value.
       */
      function toNumber(value) {
        // If value is already a number we don't need to coerce it with
        // Number().
        if (typeof value === 'number') {
          // Scratch treats NaN as 0, when needed as a number.
          // E.g., 0 + NaN -> 0.
          if (Number.isNaN(value)) {
            return 0;
          }
          return value;
        }
        var n = Number(value);
        if (Number.isNaN(n)) {
          // Scratch treats NaN as 0, when needed as a number.
          // E.g., 0 + NaN -> 0.
          return 0;
        }
        return n;
      }

      /**
       * Scratch cast to boolean.
       * In Scratch 2.0, this is captured by `interp.boolArg.`
       * Treats some string values differently from JavaScript.
       * @param {*} value Value to cast to boolean.
       * @return {boolean} The Scratch-casted boolean value.
       */
    }, {
      key: "toBoolean",
      value: function toBoolean(value) {
        // Already a boolean?
        if (typeof value === 'boolean') {
          return value;
        }
        if (typeof value === 'string') {
          // These specific strings are treated as false in Scratch.
          if (value === '' || value === '0' || value.toLowerCase() === 'false') {
            return false;
          }
          // All other strings treated as true.
          return true;
        }
        // Coerce other values and numbers.
        return Boolean(value);
      }

      /**
       * Scratch cast to string.
       * @param {*} value Value to cast to string.
       * @return {string} The Scratch-casted string value.
       */
    }, {
      key: "toString",
      value: function toString(value) {
        return String(value);
      }

      /**
       * Cast any Scratch argument to an RGB color array to be used for the renderer.
       * @param {*} value Value to convert to RGB color array.
       * @return {Array.<number>} [r,g,b], values between 0-255.
       */
    }, {
      key: "toRgbColorList",
      value: function toRgbColorList(value) {
        var color = Cast.toRgbColorObject(value);
        return [color.r, color.g, color.b];
      }

      /**
       * Cast any Scratch argument to an RGB color object to be used for the renderer.
       * @param {*} value Value to convert to RGB color object.
       * @return {RGBOject} [r,g,b], values between 0-255.
       */
    }, {
      key: "toRgbColorObject",
      value: function toRgbColorObject(value) {
        var color;
        if (typeof value === 'string' && value.substring(0, 1) === '#') {
          color = Color.hexToRgb(value);

          // If the color wasn't *actually* a hex color, cast to black
          if (!color) color = {
            r: 0,
            g: 0,
            b: 0,
            a: 255
          };
        } else {
          color = Color.decimalToRgb(Cast.toNumber(value));
        }
        return color;
      }

      /**
       * Determine if a Scratch argument is a white space string (or null / empty).
       * @param {*} val value to check.
       * @return {boolean} True if the argument is all white spaces or null / empty.
       */
    }, {
      key: "isWhiteSpace",
      value: function isWhiteSpace(val) {
        return val === null || typeof val === 'string' && val.trim().length === 0;
      }

      /**
       * Compare two values, using Scratch cast, case-insensitive string compare, etc.
       * In Scratch 2.0, this is captured by `interp.compare.`
       * @param {*} v1 First value to compare.
       * @param {*} v2 Second value to compare.
       * @returns {number} Negative number if v1 < v2; 0 if equal; positive otherwise.
       */
    }, {
      key: "compare",
      value: function compare(v1, v2) {
        var n1 = Number(v1);
        var n2 = Number(v2);
        if (n1 === 0 && Cast.isWhiteSpace(v1)) {
          n1 = NaN;
        } else if (n2 === 0 && Cast.isWhiteSpace(v2)) {
          n2 = NaN;
        }
        if (isNaN(n1) || isNaN(n2)) {
          // At least one argument can't be converted to a number.
          // Scratch compares strings as case insensitive.
          var s1 = String(v1).toLowerCase();
          var s2 = String(v2).toLowerCase();
          if (s1 < s2) {
            return -1;
          } else if (s1 > s2) {
            return 1;
          }
          return 0;
        }
        // Handle the special case of Infinity
        if (n1 === Infinity && n2 === Infinity || n1 === -Infinity && n2 === -Infinity) {
          return 0;
        }
        // Compare as numbers.
        return n1 - n2;
      }

      /**
       * Determine if a Scratch argument number represents a round integer.
       * @param {*} val Value to check.
       * @return {boolean} True if number looks like an integer.
       */
    }, {
      key: "isInt",
      value: function isInt(val) {
        // Values that are already numbers.
        if (typeof val === 'number') {
          if (isNaN(val)) {
            // NaN is considered an integer.
            return true;
          }
          // True if it's "round" (e.g., 2.0 and 2).
          return val === parseInt(val, 10);
        } else if (typeof val === 'boolean') {
          // `True` and `false` always represent integer after Scratch cast.
          return true;
        } else if (typeof val === 'string') {
          // If it contains a decimal point, don't consider it an int.
          return val.indexOf('.') < 0;
        }
        return false;
      }
    }, {
      key: "LIST_INVALID",
      get: function get() {
        return 'INVALID';
      }
    }, {
      key: "LIST_ALL",
      get: function get() {
        return 'ALL';
      }

      /**
       * Compute a 1-based index into a list, based on a Scratch argument.
       * Two special cases may be returned:
       * LIST_ALL: if the block is referring to all of the items in the list.
       * LIST_INVALID: if the index was invalid in any way.
       * @param {*} index Scratch arg, including 1-based numbers or special cases.
       * @param {number} length Length of the list.
       * @param {boolean} acceptAll Whether it should accept "all" or not.
       * @return {(number|string)} 1-based index for list, LIST_ALL, or LIST_INVALID.
       */
    }, {
      key: "toListIndex",
      value: function toListIndex(index, length, acceptAll) {
        if (typeof index !== 'number') {
          if (index === 'all') {
            return acceptAll ? Cast.LIST_ALL : Cast.LIST_INVALID;
          }
          if (index === 'last') {
            if (length > 0) {
              return length;
            }
            return Cast.LIST_INVALID;
          } else if (index === 'random' || index === 'any') {
            if (length > 0) {
              return 1 + Math.floor(Math.random() * length);
            }
            return Cast.LIST_INVALID;
          }
        }
        index = Math.floor(Cast.toNumber(index));
        if (index < 1 || index > length) {
          return Cast.LIST_INVALID;
        }
        return index;
      }
    }]);
  }();
  cast = Cast;
  return cast;
}

var castExports = requireCast();
var Cast = /*@__PURE__*/getDefaultExportFromCjs(castExports);

var en = {
	"map.name": "Map",
	"map.showMapAt": "show map at latitude [LAT] longitude [LNG] zoom [ZOOM]",
	"map.setZoom": "set zoom to [ZOOM]",
	"map.changeZoom": "change zoom by [ZOOM]",
	"map.addPoint": "drop a [COLOR] pin at latitude [LAT] longitude [LNG]",
	"map.clearPoints": "clear all points",
	"map.fitToPoints": "fit map so all points are visible",
	"map.getCurrentLocation": "get current location",
	"map.currentLat": "current latitude",
	"map.currentLng": "current longitude",
	"map.showCurrentLocation": "show current location",
	"map.distance": "distance from latitude [LAT1] longitude [LNG1] to latitude [LAT2] longitude [LNG2] (km)"
};
var ja = {
	"map.name": "地図 (Map)",
	"map.showMapAt": "緯度 [LAT] 経度 [LNG] ズーム [ZOOM] の地図を表示する",
	"map.setZoom": "ズームを [ZOOM] にする",
	"map.changeZoom": "ズームを [ZOOM] ずつ変える",
	"map.addPoint": "地点 緯度 [LAT] 経度 [LNG] に [COLOR] のピンを立てる",
	"map.clearPoints": "地点をすべて消す",
	"map.fitToPoints": "すべての地点が見えるように地図を合わせる",
	"map.getCurrentLocation": "現在地を取得する",
	"map.currentLat": "現在地の緯度",
	"map.currentLng": "現在地の経度",
	"map.showCurrentLocation": "現在位置を表示する",
	"map.distance": "緯度 [LAT1] 経度 [LNG1] から 緯度 [LAT2] 経度 [LNG2] までの距離(km)"
};
var translations = {
	en: en,
	ja: ja,
	"ja-Hira": {
	"map.name": "ちず (Map)",
	"map.showMapAt": "いど [LAT] けいど [LNG] ズーム [ZOOM] のちずをひょうじする",
	"map.setZoom": "ズームを [ZOOM] にする",
	"map.changeZoom": "ズームを [ZOOM] ずつかえる",
	"map.addPoint": "ちてん いど [LAT] けいど [LNG] に [COLOR] のピンをたてる",
	"map.clearPoints": "ちてんをすべてけす",
	"map.fitToPoints": "すべてのちてんがみえるようにちずをあわせる",
	"map.getCurrentLocation": "げんざいちをしゅとくする",
	"map.currentLat": "げんざいちのいど",
	"map.currentLng": "げんざいちのけいど",
	"map.showCurrentLocation": "げんざいちをひょうじする",
	"map.distance": "いど [LAT1] けいど [LNG1] から いど [LAT2] けいど [LNG2] までのきょり(km)"
}
};

var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABDxJREFUeNrsnL1PGzEYxp0DscDABGuYWEClGxtBzKB0ZCqR2NP+BRELK2RHIp0Yi8iMSDe2poKJhXSE6YZkr9+rDznRfdn3+uMcP5IVVMc++7mfP+49p4R4eXl5eXl5eXl5eXnpVs2mxhweHu7QjwZNn2iqz2SHNP2iadDv94fewGnjTuhHJ8G0NI1oOqNG9ubaQEbcNU07klUAiS2TRNYMU3eNVF3LFI0LDpgHam5ubv59eXkZOk8gG7YPNK0iVw2LzL7u4RwYAPBCgXmE1XnhNIFFhu7y8jI5ODggW1tbZGVl5ePfHx8fyf39PZlMJlbNh4uab9jXrEww7vT0NDJxVmDo8fExubq6iozMuYY2Axc00gd7vMss89rtNllaWkqtA/J2d3fJ+/s7eX19TftanS4oP+iCEro2BzbSMra3tyPzigq+C2VkrlVlA/fSMmBoiiqnzJ6LBiY+pq2trUXzm6igDJQVuZaTBq6vr0tXmFG2PlcEyipptXbZwETBiiqrAntCpwxM3Fa8vb1JV5hRNnTRwGEagc/Pz8KVQZkMeocuGjhKy7i5uRGuLKfMyEUD/6RlPD09CZkIj3NQRuZaVTbwNo+obrebuTBAHnzn7u6u1LUwpTsa85vkhO/jaAw888bbFDBOIBoz7Pf7n3X1SXc0pktywllgEBBWgLKsazi5jYmHlsotRqhz+Go3kA6tUDEhXXYNZwkEXSqiMCQZ8UZnDFRIoXb6TD4L9ypSp50GUlJGyB3usTrJvBAIOrO0rmoYiEihMfpME4hFzpnJDhg1kJFTZuN7a5I+Gwgs++jVNd144wZSggb0YyBRdMDKGpWSaAw7gSVygKhB/p9QFZ37RAwMVZzcqikwr0k/fhI79YWaiBpsUBHOis5obGxsTJ2uytN4PM467zKlEnW3CXK0poZMHwzFBwiEQtg9471touBkVt5rTniPDHWLCGKMUDcLxu5jzp3Yi0g0jx0dHQmbBypyRkbmHA20BdrEt9E6Axl9jdhAGUEoP+ukAuTBd2TEtanB2modgZ3YBBn6ihAmQx9PIWd+xyoDefrKdDLrBpShL+EGoFEYYNNX5rBQwnCbMrasZm5CxwoD2dFdFPp4A3kKZxYBTArrNhCISl+SYbKrug4KAwT6TjDpmzUNk74ECk/KUrhoG308hefn5x9/YyqmkP1cAvrQ0k4gTx/GBJ/2yAZJhbg2l6IwKEsf/NxA5pC4aUGbuZ9KdLQaqHLu0ymMuTCYR/owKQwk6INAabPq9CVQ2GR9U07gN5pWq05fAoWrrG/qDGR3qO0KfQkUtkUpDGTog62FC/TxFLLtkjCFgQx92E8GNojrkxCFgSh9GGElG8U9TQlRGIjS59LchzEXFn0WbrI7E730kflhTMUUb9V6WAZ+/F8Hc2Ae32c0A7/Hm+c50i3x8vLy8vLy8vLyStE/AQYAPrd5BSzLzGAAAAAASUVORK5CYII=";

function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: true } : { done: false, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = true, u = false; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = true, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }

/**
 * Formatter which is used for translation.
 * This will be replaced which is used in the runtime.
 * @param {object} messageData - format-message object
 * @returns {string} - message for the locale
 */
var formatMessage = function formatMessage(messageData) {
  return messageData.default;
};

/**
 * Setup format-message for this extension.
 */
var setupTranslations = function setupTranslations() {
  if (typeof formatMessage.setup !== 'function') return;
  var localeSetup = formatMessage.setup();
  if (localeSetup && localeSetup.translations[localeSetup.locale]) {
    Object.assign(localeSetup.translations[localeSetup.locale], translations[localeSetup.locale]);
  }
};
var EXTENSION_ID = 'map';

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
var extensionURL = 'https://asondemita.github.io/xcx-map/dist/map.mjs';

/**
 * Scratch stage size in stage units (native renderer resolution).
 * @type {number}
 */
var STAGE_WIDTH = 480;
var STAGE_HEIGHT = 360;

/**
 * Size of a map tile in pixels.
 * @type {number}
 */
var TILE_SIZE = 256;

/**
 * Base URL of OpenStreetMap standard raster tiles.
 * These tiles need no API key. Attribution to OpenStreetMap
 * contributors is required by the Tile Usage Policy:
 * https://operations.osmfoundation.org/policies/tiles/
 * @type {string}
 */
var OSM_TILE_BASE = 'https://tile.openstreetmap.org';

/**
 * Limit of the Web Mercator projection in degrees.
 * @type {number}
 */
var MERCATOR_MAX_LAT = 85.05112878;
var MIN_ZOOM = 0;
var MAX_ZOOM = 19;

/**
 * Scratch 3.0 blocks which draw maps using OpenStreetMap raster tiles.
 */
var ExtensionBlocks = /*#__PURE__*/function () {
  /**
   * Construct a set of blocks for the map extension.
   * @param {Runtime} runtime - the Scratch 3.0 runtime.
   */
  function ExtensionBlocks(runtime) {
    _classCallCheck(this, ExtensionBlocks);
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
  return _createClass(ExtensionBlocks, [{
    key: "getInfo",
    value: function getInfo() {
      setupTranslations();
      return {
        id: ExtensionBlocks.EXTENSION_ID,
        name: ExtensionBlocks.EXTENSION_NAME,
        extensionURL: ExtensionBlocks.extensionURL,
        blockIconURI: img,
        showStatusButton: false,
        blocks: [{
          opcode: 'showMapAt',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'map.showMapAt',
            default: '緯度 [LAT] 経度 [LNG] ズーム [ZOOM] の地図を表示する',
            description: 'display a map at the given location'
          }),
          arguments: {
            LAT: {
              type: ArgumentType.NUMBER,
              defaultValue: 35.681236
            },
            LNG: {
              type: ArgumentType.NUMBER,
              defaultValue: 139.767125
            },
            ZOOM: {
              type: ArgumentType.NUMBER,
              defaultValue: 13
            }
          }
        }, {
          opcode: 'setZoom',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'map.setZoom',
            default: 'ズームを [ZOOM] にする',
            description: 'set the zoom level'
          }),
          arguments: {
            ZOOM: {
              type: ArgumentType.NUMBER,
              defaultValue: 13
            }
          }
        }, {
          opcode: 'changeZoom',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'map.changeZoom',
            default: 'ズームを [ZOOM] ずつ変える',
            description: 'change the zoom level by the given amount'
          }),
          arguments: {
            ZOOM: {
              type: ArgumentType.NUMBER,
              defaultValue: 1
            }
          }
        }, {
          opcode: 'addPoint',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'map.addPoint',
            default: '地点 緯度 [LAT] 経度 [LNG] に [COLOR] のピンを立てる',
            description: 'drop a pin at a point'
          }),
          arguments: {
            LAT: {
              type: ArgumentType.NUMBER,
              defaultValue: 35.681236
            },
            LNG: {
              type: ArgumentType.NUMBER,
              defaultValue: 139.767125
            },
            COLOR: {
              type: ArgumentType.COLOR,
              defaultValue: '#e53935'
            }
          }
        }, {
          opcode: 'clearPoints',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'map.clearPoints',
            default: '地点をすべて消す',
            description: 'clear all collected points'
          })
        }, {
          opcode: 'fitToPoints',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'map.fitToPoints',
            default: 'すべての地点が見えるように地図を合わせる',
            description: 'move and zoom the map so all points are visible'
          })
        }, '---', {
          opcode: 'getCurrentLocation',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'map.getCurrentLocation',
            default: '現在地を取得する',
            description: 'get the current location of the device'
          })
        }, {
          opcode: 'currentLatReporter',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'map.currentLat',
            default: '現在地の緯度',
            description: 'latitude of the current location'
          })
        }, {
          opcode: 'currentLngReporter',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'map.currentLng',
            default: '現在地の経度',
            description: 'longitude of the current location'
          })
        }, {
          opcode: 'showCurrentLocation',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'map.showCurrentLocation',
            default: '現在位置を表示する',
            description: 'center the map on the current location'
          })
        }, {
          opcode: 'distance',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'map.distance',
            default: '緯度 [LAT1] 経度 [LNG1] から 緯度 [LAT2] 経度 [LNG2] までの距離(km)',
            description: 'distance between two points in kilometers'
          }),
          arguments: {
            LAT1: {
              type: ArgumentType.NUMBER,
              defaultValue: 35.681236
            },
            LNG1: {
              type: ArgumentType.NUMBER,
              defaultValue: 139.767125
            },
            LAT2: {
              type: ArgumentType.NUMBER,
              defaultValue: 34.702485
            },
            LNG2: {
              type: ArgumentType.NUMBER,
              defaultValue: 135.495951
            }
          }
        }]
      };
    }

    // ---- Web Mercator helpers ----

    /**
     * @param {number} zoom - integer zoom level.
     * @returns {number} - the size of the whole world in pixels at the zoom.
     */
  }, {
    key: "_worldSize",
    value: function _worldSize(zoom) {
      return TILE_SIZE * Math.pow(2, zoom);
    }

    /**
     * @param {number} lng - longitude in degrees.
     * @param {number} zoom - integer zoom level.
     * @returns {number} - world pixel x.
     */
  }, {
    key: "_lngToWorldX",
    value: function _lngToWorldX(lng, zoom) {
      return (lng + 180) / 360 * this._worldSize(zoom);
    }

    /**
     * @param {number} lat - latitude in degrees.
     * @param {number} zoom - integer zoom level.
     * @returns {number} - world pixel y.
     */
  }, {
    key: "_latToWorldY",
    value: function _latToWorldY(lat, zoom) {
      var clamped = Math.min(Math.max(lat, -MERCATOR_MAX_LAT), MERCATOR_MAX_LAT);
      var rad = clamped * Math.PI / 180;
      var y = (1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2;
      return y * this._worldSize(zoom);
    }

    /**
     * @param {number} worldX - world pixel x.
     * @param {number} zoom - integer zoom level.
     * @returns {number} - longitude in degrees.
     */
  }, {
    key: "_worldXToLng",
    value: function _worldXToLng(worldX, zoom) {
      return worldX / this._worldSize(zoom) * 360 - 180;
    }

    /**
     * @param {number} worldY - world pixel y.
     * @param {number} zoom - integer zoom level.
     * @returns {number} - latitude in degrees.
     */
  }, {
    key: "_worldYToLat",
    value: function _worldYToLat(worldY, zoom) {
      var n = Math.PI * (1 - 2 * worldY / this._worldSize(zoom));
      return Math.atan(Math.sinh(n)) * 180 / Math.PI;
    }

    /**
     * Clamp a zoom value to the supported integer range.
     * @param {number} zoom - requested zoom.
     * @returns {number} - clamped integer zoom.
     */
  }, {
    key: "_clampZoom",
    value: function _clampZoom(zoom) {
      return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.round(zoom)));
    }

    // ---- Rendering ----

    /**
     * Create the renderer skin and drawable for the map if needed.
     * @returns {boolean} - whether the skin is available.
     */
  }, {
    key: "_ensureSkin",
    value: function _ensureSkin() {
      if (this._skinId !== null) return true;
      var renderer = this.runtime && this.runtime.renderer;
      if (!renderer || typeof document === 'undefined') return false;
      var canvas = document.createElement('canvas');
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
  }, {
    key: "_loadTile",
    value: function _loadTile(url) {
      if (this._tileCache.has(url)) {
        return this._tileCache.get(url);
      }
      var promise = new Promise(function (resolve) {
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
          return resolve(img);
        };
        img.onerror = function () {
          return resolve(null);
        };
        img.src = url;
      });
      this._tileCache.set(url, promise);
      return promise;
    }

    /**
     * Draw the OpenStreetMap attribution required by the Tile Usage Policy.
     * @param {CanvasRenderingContext2D} ctx - drawing context.
     */
  }, {
    key: "_drawAttribution",
    value: function _drawAttribution(ctx) {
      var label = '© OpenStreetMap contributors';
      ctx.font = '10px sans-serif';
      var padding = 3;
      var width = ctx.measureText(label).width + padding * 2;
      var height = 14;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(STAGE_WIDTH - width, STAGE_HEIGHT - height, width, height);
      ctx.fillStyle = '#333333';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, STAGE_WIDTH - width + padding, STAGE_HEIGHT - height / 2);
    }

    /**
     * Draw a teardrop pin whose tip points at the given stage position.
     * @param {CanvasRenderingContext2D} ctx - drawing context.
     * @param {number} x - stage x of the pin tip.
     * @param {number} y - stage y of the pin tip.
     * @param {string} color - fill color of the pin head.
     */
  }, {
    key: "_drawPin",
    value: function _drawPin(ctx, x, y, color) {
      var headR = 6;
      var headCy = y - 15;
      // Left/right where the tail meets the head.
      var tailX = headR * 0.8;
      var tailY = headCy + headR * 0.55;
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
      // White center dot.
      ctx.beginPath();
      ctx.arc(x, headCy, headR * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();
    }

    /**
     * Draw a pin for every collected point that falls near the stage.
     * @param {CanvasRenderingContext2D} ctx - drawing context.
     * @param {number} zoom - current integer zoom.
     * @param {number} left - world x of the stage's left edge.
     * @param {number} top - world y of the stage's top edge.
     */
  }, {
    key: "_drawMarkers",
    value: function _drawMarkers(ctx, zoom, left, top) {
      var _iterator = _createForOfIteratorHelper(this._points),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var p = _step.value;
          var px = Math.round(this._lngToWorldX(p.lng, zoom) - left);
          var py = Math.round(this._latToWorldY(p.lat, zoom) - top);
          // Skip pins whose tip is well outside the stage.
          if (px < -20 || px > STAGE_WIDTH + 20 || py < -20 || py > STAGE_HEIGHT + 20) {
            continue;
          }
          this._drawPin(ctx, px, py, p.color);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    /**
     * Redraw the whole map onto the skin from the current state.
     * @returns {Promise} - resolves when the redraw is complete.
     */
  }, {
    key: "_redraw",
    value: function _redraw() {
      var _this = this;
      if (!this._ensureSkin()) return Promise.resolve();
      var token = ++this._redrawToken;
      var zoom = this.zoom;
      var n = Math.pow(2, zoom);
      var centerWorldX = this._lngToWorldX(this.centerLng, zoom);
      var centerWorldY = this._latToWorldY(this.centerLat, zoom);
      var left = centerWorldX - STAGE_WIDTH / 2;
      var top = centerWorldY - STAGE_HEIGHT / 2;
      var txMin = Math.floor(left / TILE_SIZE);
      var txMax = Math.floor((left + STAGE_WIDTH) / TILE_SIZE);
      var tyMin = Math.floor(top / TILE_SIZE);
      var tyMax = Math.floor((top + STAGE_HEIGHT) / TILE_SIZE);
      var jobs = [];
      for (var tx = txMin; tx <= txMax; tx++) {
        var _loop = function _loop() {
          if (ty < 0 || ty >= n) return 1; // continue
          var wrappedX = (tx % n + n) % n;
          var url = "".concat(OSM_TILE_BASE, "/").concat(zoom, "/").concat(wrappedX, "/").concat(ty, ".png");
          var dx = Math.round(tx * TILE_SIZE - left);
          var dy = Math.round(ty * TILE_SIZE - top);
          jobs.push(_this._loadTile(url).then(function (img) {
            return {
              img: img,
              dx: dx,
              dy: dy
            };
          }));
        };
        for (var ty = tyMin; ty <= tyMax; ty++) {
          if (_loop()) continue;
        }
      }
      return Promise.all(jobs).then(function (tiles) {
        // Ignore if a newer redraw started while tiles were loading.
        if (token !== _this._redrawToken) return;
        var ctx = _this._ctx;
        ctx.fillStyle = '#e8e8e8';
        ctx.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
        var _iterator2 = _createForOfIteratorHelper(tiles),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var tile = _step2.value;
            if (tile.img) ctx.drawImage(tile.img, tile.dx, tile.dy);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        _this._drawMarkers(ctx, zoom, left, top);
        _this._drawAttribution(ctx);
        _this.runtime.renderer.updateBitmapSkin(_this._skinId, _this._canvas, 1);
        _this.runtime.requestRedraw();
      });
    }

    // ---- Blocks: display / move / zoom ----
  }, {
    key: "showMapAt",
    value: function showMapAt(args) {
      this.centerLat = Cast.toNumber(args.LAT);
      this.centerLng = Cast.toNumber(args.LNG);
      this.zoom = this._clampZoom(Cast.toNumber(args.ZOOM));
      return this._redraw();
    }
  }, {
    key: "setZoom",
    value: function setZoom(args) {
      this.zoom = this._clampZoom(Cast.toNumber(args.ZOOM));
      return this._redraw();
    }
  }, {
    key: "changeZoom",
    value: function changeZoom(args) {
      this.zoom = this._clampZoom(this.zoom + Cast.toNumber(args.ZOOM));
      return this._redraw();
    }

    // ---- Blocks: fit to points ----
  }, {
    key: "clearPoints",
    value: function clearPoints() {
      this._points = [];
      return this._redraw();
    }
  }, {
    key: "addPoint",
    value: function addPoint(args) {
      this._points.push({
        lat: Cast.toNumber(args.LAT),
        lng: Cast.toNumber(args.LNG),
        color: Cast.toString(args.COLOR)
      });
      return this._redraw();
    }

    /**
     * Move and zoom the map so that every collected point is visible.
     * Picks the largest integer zoom at which the points' bounding box
     * fits inside the stage (minus a small margin), then centers on it.
     * @returns {Promise|undefined} - resolves when the redraw is complete.
     */
  }, {
    key: "fitToPoints",
    value: function fitToPoints() {
      var _this2 = this;
      if (this._points.length === 0) return;
      if (this._points.length === 1) {
        this.centerLat = this._points[0].lat;
        this.centerLng = this._points[0].lng;
        this.zoom = this._clampZoom(Math.min(MAX_ZOOM, 15));
        return this._redraw();
      }
      // Leave a margin so points are not drawn on the very edge.
      var PADDING = 24;
      var usableWidth = STAGE_WIDTH - PADDING * 2;
      var usableHeight = STAGE_HEIGHT - PADDING * 2;
      var bounds = function bounds(zoom) {
        var minX = Infinity;
        var maxX = -Infinity;
        var minY = Infinity;
        var maxY = -Infinity;
        var _iterator3 = _createForOfIteratorHelper(_this2._points),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var p = _step3.value;
            var wx = _this2._lngToWorldX(p.lng, zoom);
            var wy = _this2._latToWorldY(p.lat, zoom);
            if (wx < minX) minX = wx;
            if (wx > maxX) maxX = wx;
            if (wy < minY) minY = wy;
            if (wy > maxY) maxY = wy;
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        return {
          minX: minX,
          maxX: maxX,
          minY: minY,
          maxY: maxY
        };
      };
      // Search from the closest zoom outward for the first that fits.
      var fitZoom = MIN_ZOOM;
      for (var z = MAX_ZOOM; z >= MIN_ZOOM; z--) {
        var _b = bounds(z);
        if (_b.maxX - _b.minX <= usableWidth && _b.maxY - _b.minY <= usableHeight) {
          fitZoom = z;
          break;
        }
      }
      var b = bounds(fitZoom);
      this.centerLng = this._worldXToLng((b.minX + b.maxX) / 2, fitZoom);
      this.centerLat = this._worldYToLat((b.minY + b.maxY) / 2, fitZoom);
      this.zoom = fitZoom;
      return this._redraw();
    }

    // ---- Blocks: current location / distance ----
  }, {
    key: "getCurrentLocation",
    value: function getCurrentLocation() {
      var _this3 = this;
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        return;
      }
      return new Promise(function (resolve) {
        navigator.geolocation.getCurrentPosition(function (position) {
          _this3.currentLat = position.coords.latitude;
          _this3.currentLng = position.coords.longitude;
          resolve();
        }, function () {
          return resolve();
        }, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });
    }
  }, {
    key: "currentLatReporter",
    value: function currentLatReporter() {
      return this.currentLat;
    }
  }, {
    key: "currentLngReporter",
    value: function currentLngReporter() {
      return this.currentLng;
    }

    /**
     * Get the device's current location and center the map on it.
     * @returns {Promise|undefined} - resolves when the map has been redrawn.
     */
  }, {
    key: "showCurrentLocation",
    value: function showCurrentLocation() {
      var _this4 = this;
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        return;
      }
      return new Promise(function (resolve) {
        navigator.geolocation.getCurrentPosition(function (position) {
          _this4.currentLat = position.coords.latitude;
          _this4.currentLng = position.coords.longitude;
          _this4.centerLat = position.coords.latitude;
          _this4.centerLng = position.coords.longitude;
          Promise.resolve(_this4._redraw()).then(resolve);
        }, function () {
          return resolve();
        }, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });
    }
  }, {
    key: "distance",
    value: function distance(args) {
      var lat1 = Cast.toNumber(args.LAT1);
      var lng1 = Cast.toNumber(args.LNG1);
      var lat2 = Cast.toNumber(args.LAT2);
      var lng2 = Cast.toNumber(args.LNG2);
      var earthRadiusKm = 6371;
      var toRad = function toRad(deg) {
        return deg * Math.PI / 180;
      };
      var dLat = toRad(lat2 - lat1);
      var dLng = toRad(lng2 - lng1);
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return Math.round(earthRadiusKm * c * 1000) / 1000;
    }
  }], [{
    key: "formatMessage",
    set:
    /**
     * A translation object which is used in this class.
     * @param {FormatObject} formatter - translation object
     */
    function set(formatter) {
      formatMessage = formatter;
      if (formatMessage) setupTranslations();
    }

    /**
     * @return {string} - the name of this extension.
     */
  }, {
    key: "EXTENSION_NAME",
    get: function get() {
      return formatMessage({
        id: 'map.name',
        default: '地図 (Map)',
        description: 'name of the extension'
      });
    }

    /**
     * @return {string} - the ID of this extension.
     */
  }, {
    key: "EXTENSION_ID",
    get: function get() {
      return EXTENSION_ID;
    }

    /**
     * URL to get this extension.
     * @type {string}
     */
  }, {
    key: "extensionURL",
    get: function get() {
      return extensionURL;
    }

    /**
     * Set URL to get this extension.
     * The extensionURL will be changed to the URL of the loading server.
     * @param {string} url - URL
     */,
    set: function set(url) {
      extensionURL = url;
    }
  }]);
}();

export { ExtensionBlocks as blockClass, entry };
//# sourceMappingURL=map.mjs.map
