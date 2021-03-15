// eslint-disable import/extensions
import EmberRouter from '@ember/routing/router';
import config from 'ember-example/config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(() => ({}));

export default Router;
