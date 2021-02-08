import { document } from 'global';

const riotForStorybook = jest.requireActual('@storybook/riot');

function bootstrapADocumentAndReturnANode() {
  const rootElement = document.createElement('div');
  rootElement.id = 'root';
  document.body = document.createElement('body');
  document.body.appendChild(rootElement);
  return rootElement;
}

function makeSureThatResultIsRenderedSomehow({ context, result, rootElement }: any) {
  if (!rootElement.firstChild) {
    const { kind, name } = context;
    riotForStorybook.render({
      storyFn: () => result,
      kind,
      name,
    });
  }
}

async function getRenderedTree(story: any, context: any) {
  const rootElement = bootstrapADocumentAndReturnANode();

  const result = await story.render();

  makeSureThatResultIsRenderedSomehow({ context, result, rootElement });

  return rootElement;
}

export default getRenderedTree;
