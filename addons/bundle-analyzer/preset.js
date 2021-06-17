const detectFreePort = require('detect-port');

const analyzerPort = detectFreePort();

function managerEntries(entry = [], options) {
  return [...entry, require.resolve('./dist/esm/register')];
}

async function managerGlobals(config, { configType }) {
  return {
    ...config,
    ANALYZER_ADDRESS:
      configType === 'DEVELOPMENT'
        ? `http://localhost:${await analyzerPort}`
        : `./bundle-analyzer.html`,
  };
}

async function webpack(config, { configType, ...other }) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  const options =
    configType === 'DEVELOPMENT'
      ? { analyzerPort: await analyzerPort, analyzerMode: 'server' }
      : { reportFilename: 'bundle-analyzer.html', analyzerMode: 'static' };

  config.plugins.push(
    new BundleAnalyzerPlugin({ openAnalyzer: false, defaultSizes: 'gzip', ...options })
  );

  return config;
}

module.exports = { managerEntries, webpack, managerGlobals };
