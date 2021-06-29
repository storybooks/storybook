import root from '@storybook/global-root';

export default function addCssWarning() {
  const warning = root.document.createElement('h1');
  warning.textContent = 'CSS rules are not configured as needed';
  warning.className = 'css-rules-warning';
  warning.style.color = 'red';

  root.document.body.insertBefore(warning, root.document.body.firstChild);
}
