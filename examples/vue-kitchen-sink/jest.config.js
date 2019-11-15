const config = require('../../jest.config');

module.exports = {
  ...config,
  roots: [__dirname],
  transform: {
    ...config.transform,
    '.*\\.(vue)$': '<rootDir>/node_modules/jest-vue-preprocessor',
  },
  moduleFileExtensions: [...config.moduleFileExtensions, 'vue'],
};
