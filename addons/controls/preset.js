const { ensureDocsBeforeControls } = require('./dist/cjs/preset/ensureDocsBeforeControls');

function managerEntries(entry = [], options) {
  ensureDocsBeforeControls(options.configDir);
  return [...entry, require.resolve('./dist/esm/register')];
}

function config(entry = []) {
  return [...entry, require.resolve('./preview')];
}

module.exports = { config, managerEntries };
