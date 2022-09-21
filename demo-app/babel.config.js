const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      /**
       * This module resolver configuration does two things:
       *
       * 1. Ensures that all references to 'react' in the parent project are replaced
       * with specific pointers to the local copy of 'react' (to avoid multiple copies
       * errors).
       *
       * 2. Does the same with references to `react-native`. But, this presents an issue:
       *
       * The transformed outputs from this replacement will look like this:
       *
       * import { whatever } from '<root_dir>/demo-app/node_modules/react-native';
       *
       * But, since files outside of the root directory don't receive Expo's default babel
       * processing, these imports won't be transformed to point to `react-native-web`
       * when building for web. So, we've added some custom aliasing in webpack.config.js
       * to handle these imports.
       */
      [
        'module-resolver',
        {
          root: ['../'],
          alias: {
            react: path.resolve(__dirname, './node_modules/react'),
            'react-native': path.resolve(
              __dirname,
              './node_modules/react-native'
            ),
          },
        },
      ],
    ],
  };
};
