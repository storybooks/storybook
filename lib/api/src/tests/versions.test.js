import { init as initVersions } from '../modules/versions';

jest.mock('../version', () => ({
  version: '3.0.0',
}));

jest.mock('@storybook/global-root', () => ({
  VERSIONCHECK: JSON.stringify({
    success: true,
    data: {
      latest: {
        version: '5.2.3',
      },
      next: {
        version: '5.3.0-alpha.15',
      },
    },
    time: 1571565216284,
  }),
}));

jest.mock('@storybook/client-logger');

function createMockStore() {
  let state = {
    versions: {
      latest: {
        version: '3.0.0',
      },
      current: {
        version: '3.0.0',
      },
    },
  };
  return {
    getState: jest.fn().mockImplementation(() => state),
    setState: jest.fn().mockImplementation((s) => {
      state = { ...state, ...s };
    }),
  };
}

jest.mock('@storybook/client-logger');

describe('versions API', () => {
  it('sets initial state with current version', async () => {
    const store = createMockStore();
    const { state } = initVersions({ store });

    expect(state.versions.current).toEqual({ version: '3.0.0' });
  });

  it('sets initial state with latest version', async () => {
    const store = createMockStore();
    const { state } = initVersions({ store });

    expect(state.versions.latest).toEqual({ version: '5.2.3' });
  });

  it('sets initial state with next version', async () => {
    const store = createMockStore();
    const { state } = initVersions({ store });

    expect(state.versions.next).toEqual({ version: '5.3.0-alpha.15' });
  });

  it('sets versions in the init function', async () => {
    const store = createMockStore();
    const { state: initialState, init } = initVersions({
      store,
      fullAPI: { addNotification: jest.fn() },
    });
    store.setState(initialState);
    store.setState.mockReset();

    await init();

    expect(store.setState).toHaveBeenCalledWith({
      versions: {
        latest: { version: '5.2.3' },
        next: { version: '5.3.0-alpha.15' },
        current: { version: '3.0.0' },
      },
    });
  });

  describe('notifications', () => {
    it('sets an update notification right away in the init function', async () => {
      const store = createMockStore();
      const addNotification = jest.fn();
      const { init, state: initialState } = initVersions({
        store,
        fullAPI: { addNotification },
      });
      store.setState(initialState);

      await init();
      expect(addNotification).toHaveBeenCalled();
    });

    it('does not set an update notification if it has been dismissed', async () => {
      const store = createMockStore();
      store.setState({ dismissedVersionNotification: '5.2.3' });
      const { init, api, state: initialState } = initVersions({
        store,
        fullAPI: { addNotification: jest.fn() },
      });
      store.setState(initialState);

      const addNotification = jest.fn();
      await init();
      expect(addNotification).not.toHaveBeenCalled();
    });

    it('does not set an update notification if the latest version is a patch', async () => {
      const store = createMockStore();
      const { init, api, state: initialState } = initVersions({
        store,
        fullAPI: { addNotification: jest.fn() },
      });
      store.setState({
        ...initialState,
        versions: { ...initialState.versions, current: { version: '5.2.1' } },
      });

      const addNotification = jest.fn();
      await init();
      expect(addNotification).not.toHaveBeenCalled();
    });

    it('does not set an update notification in production mode', async () => {
      const store = createMockStore();
      const { init, api, state: initialState } = initVersions({
        store,
        fullAPI: { addNotification: jest.fn() },
      });
      store.setState(initialState);

      const addNotification = jest.fn();
      await init();
      expect(addNotification).not.toHaveBeenCalled();
    });

    it('persists a dismissed notification', async () => {
      const store = createMockStore();
      let notification;
      const addNotification = jest.fn().mockImplementation((n) => {
        notification = n;
      });

      const { init, api, state: initialState } = initVersions({
        store,
        fullAPI: { addNotification },
      });
      store.setState(initialState);

      await init();

      notification.onClear();
      expect(store.setState).toHaveBeenCalledWith(
        { dismissedVersionNotification: '5.2.3' },
        { persistence: 'permanent' }
      );
    });
  });

  it('getCurrentVersion works', async () => {
    const store = createMockStore();
    const { init, api, state: initialState } = initVersions({
      store,
      fullAPI: { addNotification: jest.fn() },
    });
    store.setState(initialState);

    await init();

    expect(api.getCurrentVersion()).toEqual({
      version: '3.0.0',
    });
  });

  it('getLatestVersion works', async () => {
    const store = createMockStore();
    const { init, api, state: initialState } = initVersions({
      store,
      fullAPI: { addNotification: jest.fn() },
    });
    store.setState(initialState);

    await init();

    expect(api.getLatestVersion()).toMatchObject({
      version: '5.2.3',
    });
  });

  describe('versionUpdateAvailable', () => {
    it('matching version', async () => {
      const store = createMockStore();
      const { init, api, state: initialState } = initVersions({
        store,
        fullAPI: { addNotification: jest.fn() },
      });
      store.setState({
        ...initialState,
        versions: {
          ...initialState.versions,
          current: { version: '5.2.1' },
          latest: { version: '5.2.1' },
        },
      });

      await init();

      expect(api.versionUpdateAvailable()).toEqual(false);
    });

    it('new patch version', async () => {
      const store = createMockStore();
      const { init, api, state: initialState } = initVersions({
        store,
        fullAPI: { addNotification: jest.fn() },
      });
      store.setState({
        ...initialState,
        versions: {
          ...initialState.versions,
          current: { version: '5.2.1' },
          latest: { version: '5.2.2' },
        },
      });

      await init();

      expect(api.versionUpdateAvailable()).toEqual(false);
    });

    it('new minor version', async () => {
      const store = createMockStore();
      const { init, api, state: initialState } = initVersions({
        store,
        fullAPI: { addNotification: jest.fn() },
      });

      await init();

      store.setState({
        ...initialState,
        versions: {
          ...initialState.versions,
          current: { version: '5.2.1' },
          latest: { version: '5.3.1' },
        },
      });

      expect(api.versionUpdateAvailable()).toEqual(true);
    });

    it('new major version', async () => {
      const store = createMockStore();
      const { init, api, state: initialState } = initVersions({
        store,
        fullAPI: { addNotification: jest.fn() },
      });

      await init();

      store.setState({
        ...initialState,
        versions: {
          ...initialState.versions,
          current: { version: '5.2.1' },
          latest: { version: '6.2.1' },
        },
      });

      expect(api.versionUpdateAvailable()).toEqual(true);
    });

    it('new prerelease version', async () => {
      const store = createMockStore();
      const { init, api, state: initialState } = initVersions({
        store,
        fullAPI: { addNotification: jest.fn() },
      });

      await init();

      store.setState({
        ...initialState,
        versions: {
          ...initialState.versions,
          current: { version: '5.2.1' },
          latest: { version: '6.2.1-prerelease.0' },
        },
      });

      expect(api.versionUpdateAvailable()).toEqual(false);
    });

    it('from older prerelease version', async () => {
      const store = createMockStore();
      const { init, api, state: initialState } = initVersions({
        store,
        fullAPI: { addNotification: jest.fn() },
      });

      await init();

      store.setState({
        ...initialState,
        versions: {
          ...initialState.versions,
          current: { version: '5.2.1-prerelease.0' },
          latest: { version: '6.2.1' },
        },
      });

      expect(api.versionUpdateAvailable()).toEqual(true);
    });

    it('from newer prerelease version', async () => {
      const store = createMockStore();
      const { init, api, state: initialState } = initVersions({
        store,
        fullAPI: { addNotification: jest.fn() },
      });

      await init();

      store.setState({
        ...initialState,
        versions: {
          ...initialState.versions,
          current: { version: '5.2.1-prerelease.0' },
          latest: { version: '3.2.1' },
        },
      });

      expect(api.versionUpdateAvailable()).toEqual(false);
    });
  });
});
