import { addons } from '@storybook/addons';
import { STORY_CHANGED } from '@storybook/core-events';
import root from '@storybook/global-root';
import { EVENTS, HIGHLIGHT_STYLE_ID } from './constants';
import { highlightStyle } from './highlight';

const { document } = root;

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

interface HighlightInfo {
  /** html selector of the element */
  elements: string[];
  color: string;
}

const channel = addons.getChannel();

const highlight = (infos: HighlightInfo) => {
  const id = HIGHLIGHT_STYLE_ID;
  resetHighlight();

  // Make sure there are no duplicated selectors
  const elements = Array.from(new Set(infos.elements));

  const sheet = document.createElement('style');
  sheet.setAttribute('id', id);
  sheet.innerHTML = elements
    .map(
      (target) =>
        `${target}{
          ${highlightStyle(infos.color)}
         }`
    )
    .join(' ');
  document.head.appendChild(sheet);
};

const resetHighlight = () => {
  const id = HIGHLIGHT_STYLE_ID;
  const sheetToBeRemoved = document.getElementById(id);
  if (sheetToBeRemoved?.parentNode) {
    sheetToBeRemoved.parentNode.removeChild(sheetToBeRemoved);
  }
};

channel.on(STORY_CHANGED, resetHighlight);
channel.on(EVENTS.HIGHLIGHT, highlight);
