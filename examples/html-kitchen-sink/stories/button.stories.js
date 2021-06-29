import root from '@storybook/global-root';
import { action } from '@storybook/addon-actions';
import { useEffect } from '@storybook/client-api';

const { document } = root;

export default {
  title: 'Demo',
};

export const Heading = () => '<h1>Hello World</h1>';
export const Headings = () =>
  '<h1>Hello World</h1><h2>Hello World</h2><h3>Hello World</h3><h4>Hello World</h4>';

export const Button = () => {
  const btn = document.createElement('button');
  btn.innerHTML = 'Hello Button';
  btn.addEventListener('click', action('Click'));
  return btn;
};

export const Effect = () => {
  useEffect(() => {
    document.getElementById('button').style.backgroundColor = 'yellow';
  });

  return '<button id="button">I should be yellow</button>';
};

export const Script = () => '<div>JS alert</div><script>alert("hello")</script>';
