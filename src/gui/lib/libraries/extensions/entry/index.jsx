/**
 * This is an extension for Xcratch.
 */

import iconURL from './entry-icon.png';
import insetIconURL from './inset-icon.svg';
import translations from './translations.json';
import {version as packageVersion} from '../../../../../../package.json';

/**
 * Formatter to translate the messages in this extension.
 * This will be replaced which is used in the React component.
 * @param {object} messageData - data for format-message
 * @returns {string} - translated message for the current locale
 */
let formatMessage = messageData => messageData.defaultMessage;

const version = `v${packageVersion}`;

const entry = {
    get name () {
        return formatMessage({
            id: 'gsiMap.entry.name',
            defaultMessage: '地図 (Map)',
            description: 'name of the extension'
        });
    },
    extensionId: 'gsiMap',
    extensionURL: 'https://tfabworks.github.io/xcx-map/dist/gsiMap.mjs',
    collaborator: 'tfabworks',
    iconURL: iconURL,
    insetIconURL: insetIconURL,
    get description () {
        return `${formatMessage({
            defaultMessage: '地理院タイルで地図を描きます。APIキー不要・どのドメインでも使えます。',
            description: 'Description for this extension',
            id: 'gsiMap.entry.description'
        })} (${version})`;
    },
    tags: ['map', 'gsi'],
    featured: true,
    disabled: false,
    bluetoothRequired: false,
    internetConnectionRequired: true,
    helpLink: 'https://tfabworks.github.io/xcx-map/',
    setFormatMessage: formatter => {
        formatMessage = formatter;
    },
    translationMap: translations
};

export {entry}; // loadable-extension needs this line.
export default entry;
