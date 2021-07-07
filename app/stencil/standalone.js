const build = require('@storybook/core/standalone');
const frameworkOptions = require('./dist/cjs/server/options').default;

async function buildStandalone(options) {
  return build(options, frameworkOptions);
}

module.exports = buildStandalone;
