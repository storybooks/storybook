import { document } from 'global';
import {
  Aurelia,
  INode,
  JitHtmlBrowserConfiguration,
  DebugConfiguration,
  CustomElement,
  Constructable,
  IViewModel,
} from 'aurelia';
import { RenderMainArgs } from './types';
import { generateKnobsFor } from '.';

const host = document.getElementById('storybook-root'); // the root iframe provided by storybook
let previousAurelia: Aurelia;
export default async function render({
  storyFn,
  selectedKind,
  selectedStory,
  showMain,
  showError,
}: RenderMainArgs) {
  const element = storyFn();

  if (!element) {
    showError({
      title: `Expecting an Aurelia component from the story: "${selectedStory}" of "${selectedKind}".`,
      description: `
        Did you forget to return the Aurelia component from the story?
        Use "() => ({ template: '<custom-component></custom-component>' })" when defining the story.
      `,
    });
  }
  showMain();

  if (previousAurelia) {
    await previousAurelia.stop().wait();
  }

  previousAurelia = new Aurelia(element.container);
  if (element.items && element.items.length > 0) {
    previousAurelia.register(...element.items);
  } else {
    previousAurelia.register(JitHtmlBrowserConfiguration, DebugConfiguration);
  }

  if (element.components && element.components.length > 0) {
    previousAurelia.container.register(...element.components);
  }

  const isConstructable = element.state && element.state.prototype;
  let { template } = element;
  if (element.customElement) {
    const def = CustomElement.getDefinition(element.customElement);
    template = `<${def.name} ${Object.keys(def.bindables)
      .map((key) => `${def.bindables[key].attribute}.bind="${def.bindables[key].property}" `)
      .join(' ')}  ></${def.name}>`;
    previousAurelia.register(element.customElement);
  }

  let State: Constructable = class {};
  if (element.state) {
    State = isConstructable ? element.state : State;
  } else if (element.customElement) {
    State = generateKnobsFor(element.customElement);
  }

  const App = CustomElement.define({ name: 'app', template }, State as Constructable);

  let app: IViewModel<INode>;
  if ((element.customElement || element.state) && !isConstructable) {
    app = Object.assign(new App(), element.state || State);
  }

  await previousAurelia
    .app({
      host,
      component: app || App,
    })
    .start()
    .wait();
}
