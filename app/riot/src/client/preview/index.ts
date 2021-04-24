import { start } from '@storybook/core/client';

import './globals';
import riot, { tag2, mount as vendorMount } from 'riot';
import render from './render';
import { compileNow as unboundCompileNow, asCompiledCode } from './compileStageFunctions';

const { configure: coreConfigure, clientApi, forceReRender } = start(render);

export const {
  setAddon,
  addDecorator,
  addParameters,
  clearDecorators,
  getStorybook,
  raw,
} = clientApi;

const framework = 'riot';
export const storiesOf = (kind: string, m: any) =>
  clientApi.storiesOf(kind, m).addParameters({ framework });
export const configure = (loadable: any, m: any) => coreConfigure(framework, loadable, m);

const mount = vendorMount.bind(riot, '#storybook-root');
const compileNow = unboundCompileNow.bind(null, tag2);
export { forceReRender, render, tag2 as tag, mount, compileNow, asCompiledCode };
