import _root from 'window-or-global';

const root = _root as typeof _root & {
  RELEASE_NOTES_DATA?: string;
  VERSIONCHECK?: string;
  CONFIG_TYPE?: 'DEVELOPMENT' | 'PRODUCTION';
  DOCS_MODE?: string;
  PREVIEW_URL?: string;
  STORYBOOK_HOOKS_CONTEXT?: any;
  __STORYBOOK_CLIENT_API__?: any;
  __STORYBOOK_STORY_STORE__?: any;
  __STORYBOOK_ADDONS_CHANNEL__?: any;
  FRAMEWORK_OPTIONS?: Record<string, unknown>;
  STORYBOOK_NAME?: string;
  LOGLEVEL?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';
  NODE_ENV?: string | 'development';
  STORYBOOK_ENV?:
    | 'SERVER'
    | 'angular'
    | 'ember'
    | 'html'
    | 'preact'
    | 'rax'
    | 'riot'
    | 'svelte'
    | 'vue'
    | 'react'
    | 'react-native'
    | 'vue3'
    | 'web-components';
  STORYBOOK_REACT_CLASSES?: Record<string, unknown>;
  FEATURES?: { previewCsfV3?: boolean };
};

export default root;
