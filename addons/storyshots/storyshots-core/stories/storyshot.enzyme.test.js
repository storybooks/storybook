import path from 'path';
import { mount } from 'enzyme';
import { createSerializer as enzymeSerializer } from 'enzyme-to-json';
import { createSerializer as emotionSerializer } from '@emotion/jest';
import initStoryshots from '../dist/ts3.9';

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  renderer: mount,
  snapshotSerializers: [enzymeSerializer(), emotionSerializer()],
});
