const { getDefaultConfig } = require('@expo/metro-config');
const { mergeConfig } = require('metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const customConfig = {
  cacheVersion: 'my-app',
  watchFolders: [],
};

module.exports = withNativeWind(mergeConfig(defaultConfig, customConfig), {
  input: './global.css',
  inlineRem: 16,
});
