/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path');

module.exports = {
  projectRoot: path.resolve(__dirname),
  /**
   * This `watchFolders` configuration will ensure source files in the parent
   * project are tracked by Metro. This supports e.g. hot-reloading on changes
   * to these directories.
   */
  watchFolders: [
    path.resolve(__dirname, '../src'), // path to the external module
    path.resolve(__dirname, '../node_modules'),
  ],
};
