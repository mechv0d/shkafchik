const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  
  // Add wasm support
  config.resolver.assetExts.push('wasm');
  
  // Add SVG support
  config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");
  config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
  config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];
  
  return config;
})();