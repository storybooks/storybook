const React = require('react');
const { ArgsStory } = require('./ArgsStory');

exports.default = {
  title: 'ArgTypes/TypeScript',
};

const typescriptFixtures = [
  'aliases',
  'arrays',
  'enums',
  'functions',
  'interfaces',
  'intersections',
  'records',
  'scalars',
  'tuples',
  'unions',
  'optionals',
];

typescriptFixtures.forEach((fixture) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const { Component } = require(`../../../lib/convert/__testfixtures__/typescript/${fixture}`);
  exports[fixture] = () => <ArgsStory component={Component} />;
});
