const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

// Expo CLI will await this method so you can optionally return a promise.
module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      /**
       * This override forces webpack to transpile files in the parent
       * directory (which it won't do by default).
       */
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          path.resolve(__dirname, '../src'),
        ],
      },
    },
    argv
  );

  /**
   * This alias handles the the babel module-resolver transformation outputs in the parent
   * directory. See babel.config.js for an explanation of why this alias is necessary.
   *
   * Basically, this aliases the babel-transformed `react-native` import references in
   * `../src` from this:
   *
   * import { whatever } from '<root_dir>/demo-app/node_modules/react-native'
   *
   * to this:
   *
   * import { whatever } from '<root_dir>/demo-app/node_modules/react-native-web'
   */
  config.resolve.alias[path.resolve(__dirname, './node_modules/react-native')] =
    path.resolve(__dirname, './node_modules/react-native-web');

  return config;
};
