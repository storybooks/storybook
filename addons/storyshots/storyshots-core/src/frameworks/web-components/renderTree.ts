async function getRenderedTree(story: { render: () => any }) {
  const component = await story.render();
  return component.getHTML ? component.getHTML() : component;
}

export default getRenderedTree;
