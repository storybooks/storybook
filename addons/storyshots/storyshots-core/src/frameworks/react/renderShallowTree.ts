import shallow from 'react-test-renderer/shallow';

async function getRenderedTree(story: any, context: any, { renderer, serializer }: any) {
  const storyElement = await story.render();
  const shallowRenderer = renderer || shallow.createRenderer();
  const tree = shallowRenderer.render(storyElement);
  return serializer ? serializer(tree) : tree;
}

export default getRenderedTree;
