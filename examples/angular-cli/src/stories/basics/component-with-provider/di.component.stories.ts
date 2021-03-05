import { componentMetadata } from '@storybook/angular';
import { DiComponent, TEST_TOKEN } from './di.component';

export default {
  title: 'Basics / Component / With Provider',
  component: DiComponent,
  decorators: [componentMetadata({ providers: [{ provide: TEST_TOKEN, useValue: 321 }] })],
};

export const InputsAndInjectDependencies = () => ({
  props: {
    title: 'Component dependencies',
  },
});

InputsAndInjectDependencies.storyName = 'inputs and inject dependencies';

export const InputsAndInjectDependenciesWithArgs = (args) => ({
  props: args,
});
InputsAndInjectDependenciesWithArgs.storyName = 'inputs and inject dependencies with args';
InputsAndInjectDependenciesWithArgs.argTypes = {
  title: { control: 'text' },
};
InputsAndInjectDependenciesWithArgs.args = {
  title: 'Component dependencies',
};
InputsAndInjectDependencies.decorators = [
  componentMetadata({ providers: [{ provide: TEST_TOKEN, useValue: 42 }] }),
];
