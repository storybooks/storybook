import root from '@storybook/global-root';

export {
  storiesOf,
  setAddon,
  addDecorator,
  addParameters,
  configure,
  getStorybook,
  forceReRender,
  raw,
} from './preview';

export {
  getCustomElements,
  setCustomElements,
  isValidComponent,
  isValidMetaData,
} from './customElements';

export * from './preview/types-6-0';

// TODO: disable HMR and do full page loads because of customElements.define
if (module && module.hot && module.hot.decline) {
  module.hot.decline();

  // forcing full reloads for customElements as elements can only be defined once per page
  const hmr = new root.EventSource('__webpack_hmr');
  hmr.addEventListener('message', function fullPageReload(event: { data: string }) {
    try {
      // Only care for built events.  Heartbeats are not parsable so we ignore those
      const { action } = JSON.parse(event.data);
      if (action === 'built') {
        root.location.reload();
      }
    } catch (error) {
      // Most part we only get here from the data in the server-sent event not being parsable which is ok
    }
  });
}
