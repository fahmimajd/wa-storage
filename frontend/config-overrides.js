const { override, addWebpackFallback } = require('customize-cra');

module.exports = override(
  addWebpackFallback({
    crypto: require.resolve('crypto-browserify'),
  })
);