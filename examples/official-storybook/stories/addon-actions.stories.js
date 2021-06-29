/* eslint-disable react/prop-types */
import { action, actions, configureActions } from '@storybook/addon-actions';
import { Form } from '@storybook/components';
import root from '@storybook/global-root';
import React, { Fragment } from 'react';

const { File } = root;

const { Button } = Form;

export default {
  title: 'Addons/Actions',
  parameters: {
    options: {
      selectedPanel: 'storybook/actions/panel',
    },
  },
};

export const ArgTypesExample = ({ onClick, onFocus }) => (
  <Button {...{ onClick, onFocus }}>Hello World</Button>
);

ArgTypesExample.argTypes = {
  onClick: { action: 'clicked!' },
  onFocus: { action: true },
};

export const ArgTypesRegexExample = (args, context) => {
  const { someFunction, onClick, onFocus } = args;
  return (
    <Button onMouseOver={someFunction} {...{ onClick, onFocus }}>
      Hello World
    </Button>
  );
};

ArgTypesRegexExample.parameters = { actions: { argTypesRegex: '^on.*' } };
ArgTypesRegexExample.argTypes = { someFunction: {}, onClick: {}, onFocus: {} };

export const BasicExample = () => <Button onClick={action('hello-world')}>Hello World</Button>;

BasicExample.storyName = 'Basic example';

export const MultipleActions = () => (
  <Button {...actions('onClick', 'onMouseOver')}>Hello World</Button>
);

MultipleActions.storyName = 'Multiple actions';

export const MultipleActionsConfig = () => (
  <Button {...actions('onClick', 'onMouseOver', { clearOnStoryChange: false })}>
    Moving away from this story will persist the action logger
  </Button>
);

MultipleActionsConfig.storyName = 'Multiple actions + config';

export const MultipleActionsAsObject = () => (
  <Button {...actions({ onClick: 'clicked', onMouseOver: 'hovered' })}>Hello World</Button>
);

MultipleActionsAsObject.storyName = 'Multiple actions as object';

export const MultipleActionsObjectConfig = () => (
  <Button
    {...actions({ onClick: 'clicked', onMouseOver: 'hovered' }, { clearOnStoryChange: false })}
  >
    Moving away from this story will persist the action logger
  </Button>
);

MultipleActionsObjectConfig.storyName = 'Multiple actions, object + config';

export const CircularPayload = () => {
  const circular = { foo: {} };
  circular.foo.circular = circular;
  return <Button onClick={() => action('circular')(circular)}>Circular Payload</Button>;
};

CircularPayload.storyName = 'Circular Payload';

export const ReservedKeywordAsName = () => <Button onClick={action('delete')}>Delete</Button>;

ReservedKeywordAsName.storyName = 'Reserved keyword as name';

export const AllTypes = () => {
  function A() {}
  function B() {}

  const bound = B.bind({});

  let file;
  try {
    file = new File([''], 'filename.txt', { type: 'text/plain', lastModified: new Date() });
  } catch (error) {
    file = error;
  }
  const reg = /fooBar/g;

  return (
    <Fragment>
      <Button onClick={() => action('Array')(['foo', 'bar', { foo: 'bar' }])}>Array</Button>
      <Button onClick={() => action('Boolean')(false)}>Boolean</Button>
      <Button onClick={() => action('Empty Object')({})}>Empty Object</Button>
      <Button onClick={() => action('File')(file)}>File</Button>
      <Button onClick={() => action('Function', { allowFunction: true })(A)}>Function A</Button>
      <Button onClick={() => action('Function (bound)', { allowFunction: true })(bound)}>
        Bound Function B
      </Button>
      <Button onClick={() => action('Infinity')(Infinity)}>Infinity</Button>
      <Button onClick={() => action('-Infinity')(-Infinity)}>-Infinity</Button>
      <Button onClick={() => action('NaN')(NaN)}>NaN</Button>
      <Button onClick={() => action('null')(null)}>null</Button>
      <Button onClick={() => action('Number')(10000)}>Number</Button>
      <Button
        onClick={() =>
          action('Multiple')(
            'foo',
            1000,
            true,
            false,
            [1, 2, 3],
            null,
            undefined,
            { foo: 'bar' },
            root
          )
        }
      >
        Multiple
      </Button>
      <Button onClick={() => action('Plain Object')({ foo: { bar: { baz: { bar: 'foo' } } } })}>
        Plain Object
      </Button>
      <Button
        onClick={() =>
          action('ObjectDepth2', { depth: 2 })({ root: { one: { two: { three: 'foo' } } } })
        }
      >
        Object (depth: 2)
      </Button>
      <Button onClick={() => action('RegExp')(reg)}>RegExp</Button>
      <Button onClick={() => action('String')('foo')}>String</Button>
      <Button onClick={() => action('Symbol')(Symbol('A_SYMBOL'))}>Symbol</Button>
      <Button onClick={action('SyntheticMouseEvent')}>SyntheticEvent</Button>
      <Button onClick={() => action('undefined')(undefined)}>undefined</Button>
      <Button onClick={() => action('window')(root)}>Window</Button>
    </Fragment>
  );
};

AllTypes.storyName = 'All types';

export const ConfigureActionsDepth = () => {
  configureActions({
    depth: 2,
  });

  return (
    <Button onClick={() => action('ConfiguredDepth')({ root: { one: { two: { three: 'foo' } } } })}>
      Object (configured depth: 2)
    </Button>
  );
};

export const PersistingTheActionLogger = () => (
  <Fragment>
    <p>Moving away from this story will persist the action logger</p>
    <Button onClick={action('clear-action-logger', { clearOnStoryChange: false })}>
      Object (configured clearOnStoryChange: false)
    </Button>
  </Fragment>
);

PersistingTheActionLogger.storyName = 'Persisting the action logger';

export const LimitActionOutput = () => {
  configureActions({
    limit: 2,
  });

  return (
    <Fragment>
      <Button onClick={() => action('False')(false)}>False</Button>
      <Button onClick={() => action('True')(true)}>True</Button>
    </Fragment>
  );
};
LimitActionOutput.storyName = 'Limit Action Output';

export const SkippedViaDisableTrue = () => (
  <Button onClick={action('hello-world')}>Hello World</Button>
);

SkippedViaDisableTrue.storyName = 'skipped via disable:true';

SkippedViaDisableTrue.parameters = {
  actions: { disable: true },
};
