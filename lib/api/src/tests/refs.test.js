import root from '@storybook/global-root';
import { getSourceType, init as initRefs } from '../modules/refs';

const { fetch } = root;

jest.mock('@storybook/global-root', () => {
  const globalMock = {
    fetch: jest.fn(() => Promise.resolve({})),
  };
  // Change global.location value to handle edge cases
  // Add additional variations of global.location mock return values in this array.
  // NOTE: The order must match the order that global.location is called in the unit tests.
  const edgecaseLocations = [
    { origin: 'https://storybook.js.org', pathname: '/storybook/index.html' },
  ];
  // global.location value after all edgecaseLocations are returned
  const lastLocation = { origin: 'https://storybook.js.org', pathname: '/storybook/' };
  Object.defineProperties(globalMock, {
    location: {
      get: edgecaseLocations
        .reduce((mockFn, location) => mockFn.mockReturnValueOnce(location), jest.fn())
        .mockReturnValue(lastLocation),
    },
  });
  return globalMock;
});

const provider = {
  getConfig: jest.fn().mockReturnValue({
    refs: {
      fake: {
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
      },
    },
  }),
};

const store = {
  getState: jest.fn().mockReturnValue({
    refs: {
      fake: {
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
      },
    },
  }),
  setState: jest.fn(() => {}),
};

const emptyResponse = Promise.resolve({
  ok: true,
  json: async () => ({}),
});

const setupResponses = (
  a = emptyResponse,
  b = emptyResponse,
  c = emptyResponse,
  d = emptyResponse
) => {
  fetch.mockClear();
  store.setState.mockClear();

  fetch.mockImplementation((l, o) => {
    if (l.includes('stories') && o.credentials === 'omit') {
      return Promise.resolve({
        ok: a.ok,
        json: a.response,
      });
    }
    if (l.includes('stories') && o.credentials === 'include') {
      return Promise.resolve({
        ok: b.ok,
        json: b.response,
      });
    }
    if (l.includes('iframe')) {
      return Promise.resolve({
        ok: c.ok,
        json: c.response,
      });
    }
    if (l.includes('metadata')) {
      return Promise.resolve({
        ok: d.ok,
        json: d.response,
      });
    }
    return Promise.resolve({
      ok: false,
      json: () => {
        throw new Error('not ok');
      },
    });
  });
};

describe('Refs API', () => {
  describe('getSourceType(source)', () => {
    // These tests must be run first and in correct order.
    // The order matches the "edgecaseLocations" order in the 'global' mock function above.
    describe('edge cases', () => {
      it('returns "local" when source matches location with /index.html in path', () => {
        // mockReturnValue(edgecaseLocations[0])
        expect(getSourceType('https://storybook.js.org/storybook/iframe.html')).toEqual([
          'local',
          'https://storybook.js.org/storybook',
        ]);
      });
      it('returns "correct url" when source does not match location', () => {
        expect(getSourceType('https://external.com/storybook/')).toEqual([
          'external',
          'https://external.com/storybook',
        ]);
      });
    });
    // Other tests use "lastLocation" for the 'global' mock
    it('returns "local" when source matches location', () => {
      expect(getSourceType('https://storybook.js.org/storybook/iframe.html')).toEqual([
        'local',
        'https://storybook.js.org/storybook',
      ]);
    });
    it('returns "external" when source does not match location', () => {
      expect(getSourceType('https://external.com/storybook/iframe.html')).toEqual([
        'external',
        'https://external.com/storybook',
      ]);
    });
  });

  describe('checkRef', () => {
    it('on initialization it checks refs', async () => {
      // given
      initRefs({ provider, store });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
        ]
      `);
    });

    it('passes version when set on the ref', async () => {
      // given
      provider.getConfig.mockReturnValueOnce({
        refs: {
          fake: {
            id: 'fake',
            url: 'https://example.com',
            title: 'Fake',
            version: '2.1.3-rc.2',
          },
        },
      });
      initRefs({ provider, store });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/stories.json?version=2.1.3-rc.2",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
        ]
      `);
    });

    it('checks refs (all fail)', async () => {
      // given
      const { api } = initRefs({ provider, store }, { runCheck: false });

      setupResponses(
        {
          ok: false,
          response: async () => {
            throw new Error('Failed to fetch');
          },
        },
        {
          ok: false,
          response: async () => {
            throw new Error('Failed to fetch');
          },
        },
        {
          ok: false,
          response: async () => {
            throw new Error('not ok');
          },
        }
      );

      await api.checkRef({
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
      });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
        ]
      `);

      expect(store.setState.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "refs": Object {
            "fake": Object {
              "error": Object {
                "message": "Error: Loading of ref failed
          at fetch (lib/api/src/modules/refs.ts)

        URL: https://example.com

        We weren't able to load the above URL,
        it's possible a CORS error happened.

        Please check your dev-tools network tab.",
              },
              "id": "fake",
              "ready": false,
              "stories": undefined,
              "title": "Fake",
              "type": "auto-inject",
              "url": "https://example.com",
            },
          },
        }
      `);
    });

    it('checks refs (success)', async () => {
      // given
      const { api } = initRefs({ provider, store }, { runCheck: false });

      setupResponses(
        {
          ok: true,
          response: async () => ({ stories: {} }),
        },
        {
          ok: true,
          response: async () => ({ stories: {} }),
        },
        {
          ok: true,
          response: async () => {
            throw new Error('not ok');
          },
        },
        {
          ok: true,
          response: async () => ({
            versions: {},
          }),
        }
      );

      await api.checkRef({
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
      });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/metadata.json",
            Object {
              "cache": "no-cache",
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
        ]
      `);

      expect(store.setState.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "refs": Object {
            "fake": Object {
              "error": undefined,
              "id": "fake",
              "ready": false,
              "stories": Object {},
              "title": "Fake",
              "type": "lazy",
              "url": "https://example.com",
              "versions": Object {},
            },
          },
        }
      `);
    });

    it('checks refs (auth)', async () => {
      // given
      const { api } = initRefs({ provider, store }, { runCheck: false });

      setupResponses(
        {
          ok: true,
          response: async () => ({ loginUrl: 'https://example.com/login' }),
        },
        {
          ok: false,
          response: async () => {
            throw new Error('not ok');
          },
        },
        {
          ok: true,
          response: async () => {
            throw new Error('not ok');
          },
        },
        {
          ok: false,
          response: async () => {
            throw new Error('not ok');
          },
        }
      );

      await api.checkRef({
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
      });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
        ]
      `);

      expect(store.setState.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "refs": Object {
            "fake": Object {
              "error": Object {
                "message": "Error: Loading of ref failed
          at fetch (lib/api/src/modules/refs.ts)

        URL: https://example.com

        We weren't able to load the above URL,
        it's possible a CORS error happened.

        Please check your dev-tools network tab.",
              },
              "id": "fake",
              "ready": false,
              "stories": undefined,
              "title": "Fake",
              "type": "auto-inject",
              "url": "https://example.com",
            },
          },
        }
      `);
    });

    it('checks refs (mixed)', async () => {
      // given
      const { api } = initRefs({ provider, store }, { runCheck: false });

      fetch.mockClear();
      store.setState.mockClear();

      setupResponses(
        {
          ok: true,
          response: async () => ({ loginUrl: 'https://example.com/login' }),
        },
        {
          ok: true,
          response: async () => ({ stories: {} }),
        },
        {
          ok: true,
          response: async () => {
            throw new Error('not ok');
          },
        },
        {
          ok: true,
          response: async () => ({
            versions: { '1.0.0': 'https://example.com/v1', '2.0.0': 'https://example.com' },
          }),
        }
      );

      await api.checkRef({
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
      });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/metadata.json",
            Object {
              "cache": "no-cache",
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
        ]
      `);

      expect(store.setState.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "refs": Object {
            "fake": Object {
              "error": undefined,
              "id": "fake",
              "ready": false,
              "stories": Object {},
              "title": "Fake",
              "type": "lazy",
              "url": "https://example.com",
              "versions": Object {
                "1.0.0": "https://example.com/v1",
                "2.0.0": "https://example.com",
              },
            },
          },
        }
      `);
    });

    it('checks refs (serverside-success)', async () => {
      // given
      const { api } = initRefs({ provider, store }, { runCheck: false });

      setupResponses(
        {
          ok: false,
          response: async () => {
            throw new Error('Failed to fetch');
          },
        },
        {
          ok: true,
          response: async () => {
            throw new Error('not ok');
          },
        },
        {
          ok: false,
          response: async () => {
            throw new Error('Failed to fetch');
          },
        }
      );

      await api.checkRef({
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
        type: 'server-checked',
      });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "omit",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
        ]
      `);

      expect(store.setState.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "refs": Object {
            "fake": Object {
              "error": undefined,
              "id": "fake",
              "ready": false,
              "stories": undefined,
              "title": "Fake",
              "type": "auto-inject",
              "url": "https://example.com",
            },
          },
        }
      `);
    });

    it('checks refs (serverside-fail)', async () => {
      // given
      const { api } = initRefs({ provider, store }, { runCheck: false });

      setupResponses(
        {
          ok: false,
          response: async () => {
            throw new Error('Failed to fetch');
          },
        },
        {
          ok: true,
          response: async () => {
            throw new Error('not ok');
          },
        },
        {
          ok: false,
          response: async () => {
            throw new Error('Failed to fetch');
          },
        }
      );

      await api.checkRef({
        id: 'fake',
        url: 'https://example.com',
        title: 'Fake',
        type: 'unknown',
      });

      expect(fetch.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://example.com/stories.json",
            Object {
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
          Array [
            "https://example.com/metadata.json",
            Object {
              "cache": "no-cache",
              "credentials": "include",
              "headers": Object {
                "Accept": "application/json",
              },
            },
          ],
        ]
      `);

      expect(store.setState.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "refs": Object {
            "fake": Object {
              "error": [Error: not ok],
              "id": "fake",
              "ready": false,
              "stories": undefined,
              "title": "Fake",
              "type": "auto-inject",
              "url": "https://example.com",
            },
          },
        }
      `);
    });
  });
});
