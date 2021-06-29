import root from '@storybook/global-root';

const { document } = root;

// HMR will cause this code to be invoked multiple times, so each warning should have a unique ID
export default function addHeadWarning(id, text) {
  if (!document.getElementById(id)) {
    const warning = document.createElement('h1');
    warning.textContent = text;
    warning.id = id;
    warning.style.backgroundColor = 'tomato';
    warning.style.padding = '10px';

    document.body.insertBefore(warning, document.body.firstChild);
  }
}
