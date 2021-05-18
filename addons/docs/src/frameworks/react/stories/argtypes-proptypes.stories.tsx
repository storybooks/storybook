const React = require('react');
const { ArgsStory } = require('./ArgsStory');

exports.default = {
  title: 'ArgTypes/PropTypes',
};

const proptypesFixtures = ['arrays', 'enums', 'misc', 'objects', 'react', 'scalars'];

proptypesFixtures.forEach((fixture) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const { Component } = require(`../../../lib/convert/__testfixtures__/proptypes/${fixture}`);
  exports[fixture] = () => <ArgsStory component={Component} />;
});
