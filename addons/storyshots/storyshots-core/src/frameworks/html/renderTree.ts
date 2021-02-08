import { document, Node } from 'global';

async function getRenderedTree(story: { render: () => any }) {
  const component = await story.render();

  if (component instanceof Node) {
    return component;
  }

  const section: HTMLElement = document.createElement('section');
  section.innerHTML = component;

  if (section.childElementCount > 1) {
    return section;
  }

  return section.firstChild;
}

export default getRenderedTree;
