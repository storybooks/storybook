import { document } from 'global';
import dedent from 'ts-dedent';
import { unregister } from 'riot';
import { render as renderRiot } from './rendering';

export default function renderMain({
  storyFn,
  kind,
  name,
  showMain = () => {},
  showError = () => {},
}: {
  storyFn: Function;
  kind: string;
  name: string;
  showMain: () => any;
  showError: (input: { title: string; description: string }) => void;
}) {
  showMain();
  unregister('#storybook-root');
  const rootElement = document.getElementById('storybook-root');
  rootElement.innerHTML = '';
  rootElement.dataset.is = 'root';
  const element = storyFn();
  const rendered = renderRiot(element);
  if (!rendered) {
    showError({
      title: `Expecting a riot snippet or a riot component from the story: "${name}" of "${kind}".`,
      description: dedent`
        Did you forget to return the component snippet from the story?
        Use "() => <your snippet or node>" or when defining the story.
      `,
    });
  }
  return rendered;
}
