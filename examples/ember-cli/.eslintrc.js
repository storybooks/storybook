module.exports = {
  rules: {
    'import/extensions': 'off',
    'react/prefer-stateless-function': 'off'
  },
  settings: {
    'import/core-modules': [
      '@ember/component',
      '@ember/routing/router',
      '@ember/application',
      '@glimmer/component',
      './config/environment',
    ],
  },
};
