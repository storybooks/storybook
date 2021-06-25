import global from 'global';
import dedent from 'ts-dedent';
import { RenderContext, ElementArgs, OptionsArgs } from './types';

const { window: globalWindow, document } = global;

declare let Ember: any;

const rootElement = document.getElementById('root');

const config = globalWindow.require(`${globalWindow.STORYBOOK_NAME}/config/environment`);
const app = globalWindow.require(`${globalWindow.STORYBOOK_NAME}/app`).default.create({
  autoboot: false,
  rootElement,
  ...config.APP,
});

let lastPromise = app.boot();
let hasRendered = false;
let isRendering = false;

function render(options: OptionsArgs, el: ElementArgs) {
  if (isRendering) return;
  isRendering = true;

  const { template, context = {}, element } = options;

  if (hasRendered) {
    lastPromise = lastPromise.then((instance: any) => instance.destroy());
  }

  lastPromise = lastPromise
    .then(() => {
      const appInstancePrivate = app.buildInstance();
      return appInstancePrivate.boot().then(() => appInstancePrivate);
    })
    .then((instance: any) => {
      instance.register(
        'component:story-mode',
        Ember.Component.extend({
          layout: template || options,
          ...context,
        })
      );

      const component = instance.lookup('component:story-mode');

      if (element) {
        component.appendTo(element);

        element.appendTo(el);
      } else {
        component.appendTo(el);
      }
      hasRendered = true;
      isRendering = false;

      return instance;
    });
}

export default function renderMain({
  storyFn,
  kind,
  name,
  showError,
  targetDOMNode = rootElement,
}: RenderContext) {
  const element = storyFn();

  if (!element) {
    showError({
      title: `Expecting a Ember element from the story: "${name}" of "${kind}".`,
      description: dedent`
        Did you forget to return the Ember element from the story?
        Use "() => hbs('{{component}}')" or "() => { return {
          template: hbs\`{{component}}\`
        } }" when defining the story.
      `,
    });
    return;
  }

  render(element, { el: targetDOMNode });
}
