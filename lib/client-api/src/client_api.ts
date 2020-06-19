/* eslint no-underscore-dangle: 0 */
import { logger } from '@storybook/client-logger';
import { StoryFn, Parameters, DecorateStoryFunction } from '@storybook/addons';
import { toId } from '@storybook/csf';

import {
  ClientApiParams,
  DecoratorFunction,
  ClientApiAddons,
  StoryApi,
  ComponentArgTypesEnhancer,
  StoryArgTypesEnhancer,
} from './types';
import { applyHooks } from './hooks';
import StoryStore from './story_store';
import { defaultDecorateStory } from './decorators';

// ClientApi (and StoreStore) are really singletons. However they are not created until the
// relevant framework instanciates them via `start.js`. The good news is this happens right away.
let singleton: ClientApi;

export const addDecorator = (decorator: DecoratorFunction) => {
  if (!singleton)
    throw new Error(`Singleton client API not yet initialized, cannot call addDecorator`);

  singleton.addDecorator(decorator);
};
export const addParameters = (parameters: Parameters) => {
  if (!singleton)
    throw new Error(`Singleton client API not yet initialized, cannot call addParameters`);

  singleton.addParameters(parameters);
};

export const addComponentArgTypesEnhancer = (enhancer: ComponentArgTypesEnhancer) => {
  if (!singleton)
    throw new Error(
      `Singleton client API not yet initialized, cannot call addComponentArgTypesEnhancer`
    );

  singleton.addComponentArgTypesEnhancer(enhancer);
};

export const addStoryArgTypesEnhancer = (enhancer: StoryArgTypesEnhancer) => {
  if (!singleton)
    throw new Error(
      `Singleton client API not yet initialized, cannot call addStoryArgTypesEnhancer`
    );

  singleton.addStoryArgTypesEnhancer(enhancer);
};

export default class ClientApi {
  private _storyStore: StoryStore;

  private _addons: ClientApiAddons<unknown>;

  private _decorateStory: DecorateStoryFunction;

  // React Native Fast refresh doesn't allow multiple dispose calls
  private _noStoryModuleAddMethodHotDispose: boolean;

  constructor({
    storyStore,
    decorateStory = defaultDecorateStory,
    noStoryModuleAddMethodHotDispose,
  }: ClientApiParams) {
    this._storyStore = storyStore;
    this._addons = {};

    this._noStoryModuleAddMethodHotDispose = noStoryModuleAddMethodHotDispose || false;

    this._decorateStory = decorateStory;

    if (!storyStore) throw new Error('storyStore is required');

    singleton = this;
  }

  setAddon = (addon: any) => {
    this._addons = {
      ...this._addons,
      ...addon,
    };
  };

  getSeparators = () => {
    const { hierarchySeparator, hierarchyRootSeparator, showRoots } =
      this._storyStore._globalMetadata.parameters.options || {};

    // Note these checks will be removed in 6.0, leaving this much simpler
    if (
      typeof hierarchySeparator !== 'undefined' ||
      typeof hierarchyRootSeparator !== 'undefined'
    ) {
      return { hierarchySeparator, hierarchyRootSeparator };
    }
    if (
      typeof showRoots === 'undefined' &&
      this.store()
        .getStoryKinds()
        .some((kind) => kind.match(/\.|\|/))
    ) {
      return {
        hierarchyRootSeparator: '|',
        hierarchySeparator: /\/|\./,
      };
    }
    return { hierarchySeparator: '/' };
  };

  addDecorator = (decorator: DecoratorFunction) => {
    this._storyStore.addGlobalMetadata({ decorators: [decorator], parameters: {} });
  };

  addParameters = (parameters: Parameters) => {
    this._storyStore.addGlobalMetadata({ decorators: [], parameters });
  };

  addComponentArgTypesEnhancer = (enhancer: ComponentArgTypesEnhancer) => {
    this._storyStore.addComponentArgTypesEnhancer(enhancer);
  };

  addStoryArgTypesEnhancer = (enhancer: StoryArgTypesEnhancer) => {
    this._storyStore.addStoryArgTypesEnhancer(enhancer);
  };

  clearDecorators = () => {
    this._storyStore.clearGlobalDecorators();
  };

  // what are the occasions that "m" is a boolean vs an obj
  storiesOf = <StoryFnReturnType = unknown>(
    kind: string,
    m: NodeModule
  ): StoryApi<StoryFnReturnType> => {
    if (!kind && typeof kind !== 'string') {
      throw new Error('Invalid or missing kind provided for stories, should be a string');
    }

    if (!m) {
      logger.warn(
        `Missing 'module' parameter for story with a kind of '${kind}'. It will break your HMR`
      );
    }

    if (m) {
      const proto = Object.getPrototypeOf(m);
      if (proto.exports && proto.exports.default) {
        // FIXME: throw an error in SB6.0
        logger.error(
          `Illegal mix of CSF default export and storiesOf calls in a single file: ${proto.i}`
        );
      }
    }

    if (m && m.hot && m.hot.dispose) {
      m.hot.dispose(() => {
        const { _storyStore } = this;
        // If HMR dispose happens in a story file, we know that HMR will pass up to the configuration file (preview.js)
        // and be handled by the HMR.allow in config_api, leading to a re-run of configuration.
        // So configuration is about to happen--we can skip the safety check.
        _storyStore.removeStoryKind(kind, { allowUnsafe: true });
      });
    }

    let hasAdded = false;
    const api: StoryApi<StoryFnReturnType> = {
      kind: kind.toString(),
      add: () => api,
      addDecorator: () => api,
      addParameters: () => api,
    };

    // apply addons
    Object.keys(this._addons).forEach((name) => {
      const addon = this._addons[name];
      api[name] = (...args: any[]) => {
        addon.apply(api, args);
        return api;
      };
    });

    api.add = (
      storyName: string,
      storyFn: StoryFn<StoryFnReturnType>,
      parameters: Parameters = {}
    ) => {
      hasAdded = true;

      const id = parameters.__id || toId(kind, storyName);

      if (typeof storyName !== 'string') {
        throw new Error(`Invalid or missing storyName provided for a "${kind}" story.`);
      }

      if (!this._noStoryModuleAddMethodHotDispose && m && m.hot && m.hot.dispose) {
        m.hot.dispose(() => {
          const { _storyStore } = this;
          // See note about allowUnsafe above
          _storyStore.remove(id, { allowUnsafe: true });
        });
      }

      const fileName = m && m.id ? `${m.id}` : undefined;

      const { decorators, ...storyParameters } = parameters;
      this._storyStore.addStory(
        {
          id,
          kind,
          name: storyName,
          storyFn,
          parameters: { fileName, ...storyParameters },
          decorators,
        },
        {
          applyDecorators: applyHooks(this._decorateStory),
        }
      );
      return api;
    };

    api.addDecorator = (decorator: DecoratorFunction<StoryFnReturnType>) => {
      if (hasAdded)
        throw new Error(`You cannot add a decorator after the first story for a kind.
Read more here: https://github.com/storybookjs/storybook/blob/master/MIGRATION.md#can-no-longer-add-decorators-parameters-after-stories`);

      this._storyStore.addKindMetadata(kind, {
        decorators: [decorator],
        parameters: [],
      });
      return api;
    };

    api.addParameters = (parameters: Parameters) => {
      if (hasAdded)
        throw new Error(`You cannot add parameters after the first story for a kind.
Read more here: https://github.com/storybookjs/storybook/blob/master/MIGRATION.md#can-no-longer-add-decorators-parameters-after-stories`);

      this._storyStore.addKindMetadata(kind, { decorators: [], parameters });
      return api;
    };

    return api;
  };

  getStorybook = () => this._storyStore.getStorybook();

  raw = () => this._storyStore.raw();

  // FIXME: temporary expose the store for react-native
  // Longer term react-native should use the Provider/Consumer api
  store = () => this._storyStore;
}
