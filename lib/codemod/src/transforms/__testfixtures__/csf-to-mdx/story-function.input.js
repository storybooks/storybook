import root from '@storybook/global-root';

const { document } = root;

export default {
  title: 'Function',
};

export const functionStory = () => {
  const btn = document.createElement('button');
  btn.innerHTML = 'Hello Button';
  btn.addEventListener('click', action('Click'));
  return btn;
};

functionStory.story = {
  name: 'function',
  height: '100px',
};
