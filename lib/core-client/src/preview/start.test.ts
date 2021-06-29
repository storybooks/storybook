import root from '@storybook/global-root';
import start from './start';

const { document } = root;

jest.mock('@storybook/client-logger');
jest.mock('@storybook/global-root', () => ({
  history: { replaceState: jest.fn() },
  location: { search: '' },
  navigator: { userAgent: 'browser', platform: '' },
  __STORYBOOK_CLIENT_API__: undefined,
  addEventListener: jest.fn(),
  postMessage: jest.fn(),
  matchMedia: jest.fn().mockReturnValue({ matches: false }),
  document: {
    addEventListener: jest.fn(),
    getElementById: jest.fn().mockReturnValue({}),
    body: { classList: { add: jest.fn(), remove: jest.fn() }, style: {} },
    documentElement: {},
    location: { search: '?id=kind--story&args=a:2;b:two;c:true' },
  },
}));

afterEach(() => {
  root.__STORYBOOK_CLIENT_API__ = undefined;
});

it('returns apis', () => {
  const render = jest.fn();

  const result = start(render);

  expect(result).toEqual(
    expect.objectContaining({
      configure: expect.any(Function),
      channel: expect.any(Object),
      clientApi: expect.any(Object),
      configApi: expect.any(Object),
      forceReRender: expect.any(Function),
    })
  );
});

it('reuses the current client api when the lib is reloaded', () => {
  const render = jest.fn();

  const { clientApi } = start(render);

  const valueOfClientApi = root.__STORYBOOK_CLIENT_API__;

  const { clientApi: newClientApi } = start(render);

  expect(clientApi).toEqual(newClientApi);
  expect(clientApi).toEqual(valueOfClientApi);
});

// With async rendering we need to wait for various promises to resolve.
// Sleeping for 0 ms allows all the async (but instantaneous) calls to run
// through the event loop.
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

it('calls render when you add a story', async () => {
  const render = jest.fn();

  const { clientApi, configApi } = start(render);

  configApi.configure(() => {
    clientApi.storiesOf('kind', {} as NodeModule).add('story', () => {});
  }, {} as NodeModule);

  await sleep(0);
  expect(render).toHaveBeenCalledWith(expect.objectContaining({ kind: 'kind', name: 'story' }));
});

it('uses args from URL param when rendering story', async () => {
  const render = jest.fn();
  const argTypes = {
    a: { type: { name: 'number' }, defaultValue: 1 },
    b: { type: { name: 'number' }, defaultValue: 1 },
    c: { type: { name: 'boolean' } },
  };

  const { clientApi, configApi } = start(render);

  configApi.configure(() => {
    clientApi.storiesOf('kind', {} as NodeModule).add('story', () => {}, { argTypes });
  }, {} as NodeModule);

  await sleep(0);
  expect(render).toHaveBeenCalledWith(
    expect.objectContaining({ kind: 'kind', name: 'story', args: { a: 2, b: NaN, c: true } })
  );
});

it('emits an exception and shows error when your story throws', async () => {
  const render = jest.fn().mockImplementation(() => {
    throw new Error('Some exception');
  });

  const { clientApi, configApi } = start(render);

  configApi.configure(() => {
    clientApi.storiesOf('kind', {} as NodeModule).add('story1', () => {});
  }, {} as NodeModule);

  await sleep(0);
  expect(render).toHaveBeenCalled();
  expect(document.body.classList.add).toHaveBeenCalledWith('sb-show-errordisplay');
});

it('emits an error and shows error when your framework calls showError', async () => {
  const error = {
    title: 'Some error',
    description: 'description',
  };
  const render = jest.fn().mockImplementation(({ showError }) => {
    showError(error);
  });

  const { clientApi, configApi } = start(render);

  configApi.configure(() => {
    clientApi.storiesOf('kind', {} as NodeModule).add('story', () => {});
  }, {} as NodeModule);

  await sleep(0);
  expect(render).toHaveBeenCalled();
  expect(document.body.classList.add).toHaveBeenCalledWith('sb-show-errordisplay');
});
