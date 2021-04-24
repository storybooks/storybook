import { document, fetch, Node } from 'global';
import dedent from 'ts-dedent';
import { Args, ArgTypes } from '@storybook/api';
import { simulatePageLoad, simulateDOMContentLoaded } from '@storybook/client-api';
import { RenderContext, FetchStoryHtmlType } from './types';

const rootElement = document.getElementById('storybook-root');

const defaultFetchStoryHtml: FetchStoryHtmlType = async (url, path, params, storyContext) => {
  const fetchUrl = new URL(`${url}/${path}`);
  fetchUrl.search = new URLSearchParams({ ...storyContext.globals, ...params }).toString();

  const response = await fetch(fetchUrl);
  return response.text();
};

const buildStoryArgs = (args: Args, argTypes: ArgTypes) => {
  const storyArgs = { ...args };

  Object.keys(argTypes).forEach((key: string) => {
    const argType = argTypes[key];
    const { control } = argType;
    const controlType = control && control.type.toLowerCase();
    const argValue = storyArgs[key];
    switch (controlType) {
      case 'date':
        // For cross framework & language support we pick a consistent representation of Dates as strings
        storyArgs[key] = new Date(argValue).toISOString();
        break;
      case 'array': {
        // use the supplied separator when serializing an array as a string
        const separator = control.separator || ',';
        storyArgs[key] = argValue.join(separator);
        break;
      }
      case 'object':
        // send objects as JSON strings
        storyArgs[key] = JSON.stringify(argValue);
        break;
      default:
    }
  });

  return storyArgs;
};

export async function renderMain({
  id,
  kind,
  name,
  showMain,
  showError,
  forceRender,
  parameters,
  storyContext,
  storyFn,
  args,
  argTypes,
}: RenderContext) {
  // Some addons wrap the storyFn so we need to call it even though Server doesn't need the answer
  storyFn();
  const storyArgs = buildStoryArgs(args, argTypes);

  const {
    server: { url, id: storyId, fetchStoryHtml = defaultFetchStoryHtml, params },
  } = parameters;

  const fetchId = storyId || id;
  const storyParams = { ...params, ...storyArgs };
  const element = await fetchStoryHtml(url, fetchId, storyParams, storyContext);

  showMain();
  if (typeof element === 'string') {
    rootElement.innerHTML = element;
    simulatePageLoad(rootElement);
  } else if (element instanceof Node) {
    // Don't re-mount the element if it didn't change and neither did the story
    if (rootElement.firstChild === element && forceRender === true) {
      return;
    }

    rootElement.innerHTML = '';
    rootElement.appendChild(element);
    simulateDOMContentLoaded();
  } else {
    showError({
      title: `Expecting an HTML snippet or DOM node from the story: "${name}" of "${kind}".`,
      description: dedent`
        Did you forget to return the HTML snippet from the story?
        Use "() => <your snippet or node>" or when defining the story.
      `,
    });
  }
}
