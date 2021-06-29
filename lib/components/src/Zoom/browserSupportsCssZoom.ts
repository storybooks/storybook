import root from '@storybook/global-root';

export function browserSupportsCssZoom(): boolean {
  try {
    return root.document.implementation.createHTMLDocument('').body.style.zoom !== undefined;
  } catch (error) {
    return false;
  }
}
