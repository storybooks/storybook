import { window as globalWindow } from 'global';

export function browserSupportsCssZoom(): boolean {
  try {
    return (
      globalWindow.document.implementation.createHTMLDocument('').body.style.zoom !== undefined
    );
  } catch (error) {
    return false;
  }
}
