import { document } from 'global';
import { stripIndents } from 'common-tags';
import Marionette, { View } from 'backbone.marionette';
import isMarionetteRenderable from './element_check';

const rootEl = document.getElementById('storybook-root');
const rootRegion = new Marionette.Region({ el: rootEl });

function render(view: View<any>) {
  rootRegion.show(view);
}

export default function renderMain({
  storyFn,
  kind,
  name,
  showMain,
  showError,
}: {
  storyFn: any;
  kind: string;
  name: string;
  showMain: () => any;
  showError: (options: { title: string; description: string }) => void;
}) {
  const element = storyFn();

  if (!element) {
    showError({
      title: `Expecting a Marionette View from the story: "${name}" of "${kind}".`,
      description: stripIndents`
        Did you forget to return the React element from the story?
        Use "() => (<MyComp/>)" or "() => { return <MyComp/>; }" when defining the story.
      `,
    });
    return;
  }

  if (!isMarionetteRenderable(element)) {
    showError({
      title: `Expecting a valid Marionette View from the story: "${name}" of "${kind}".`,
      description: stripIndents`
        Seems like you are not returning a correct Marionette View from the story.
        Could you double check that?
      `,
    });
    return;
  }

  render(element);
  showMain();
}
