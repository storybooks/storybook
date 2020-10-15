import React, { useState } from 'react';
import { styled } from '@storybook/theming';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Input, Button, Select, Textarea, NumericInput } from './input/input';
import { Field } from './field/field';
import { Spaced } from '../spaced/Spaced';

const Flexed = styled(Field)({ display: 'flex' });

storiesOf('Basics/Form/Field', module).add('field', () => (
  <Field key="key" label="label">
    <Select value="val2" onChange={action('onChange')} size={1}>
      <option value="val1">Value 1</option>
      <option value="val2">Value 2</option>
      <option value="val3">Value 3</option>
    </Select>
  </Field>
));

storiesOf('Basics/Form/Select', module)
  .add('sizes', () => (
    <Spaced>
      {['auto', 'flex', '100%'].map((size) => (
        <Flexed key={size} label={size}>
          <Select value="val2" onChange={action('onChange')} size={size}>
            <option value="val1">Value 1</option>
            <option value="val2">Value 2</option>
            <option value="val3">Value 3</option>
          </Select>
        </Flexed>
      ))}
    </Spaced>
  ))
  .add('validations', () => (
    <div>
      <Spaced>
        {['error', 'warn', 'valid', null].map((valid) => (
          <Field label={String(valid)}>
            <Select
              key={valid}
              value="val2"
              onChange={action('onChange')}
              size="100%"
              valid={valid}
            >
              <option value="val1">Value 1</option>
              <option value="val2">Value 2</option>
              <option value="val3">Value 3</option>
            </Select>
          </Field>
        ))}
      </Spaced>
      <Field label="select">
        <Select value="val2" onChange={action('onChange')} size="100%" disabled>
          <option value="val1">Value 1</option>
          <option value="val2">Value 2</option>
          <option value="val3">Value 3</option>
        </Select>
      </Field>
    </div>
  ));

storiesOf('Basics/Form/Button', module)
  .add('sizes', () => (
    <Spaced>
      {['auto', 'flex', '100%'].map((size) => (
        <Flexed key={size} label={size}>
          <Button size={size}>click this button</Button>
        </Flexed>
      ))}
    </Spaced>
  ))
  .add('validations', () => (
    <Spaced>
      {['error', 'warn', 'valid', null].map((valid) => (
        <Flexed key={valid} label={String(valid)}>
          <Button size="100%" valid={valid}>
            click this button
          </Button>
        </Flexed>
      ))}
    </Spaced>
  ));

storiesOf('Basics/Form/Textarea', module)
  .add('sizes', () => (
    <Spaced>
      {['auto', 'flex', '100%'].map((size) => (
        <Flexed key={size} label={size}>
          <Textarea defaultValue="textarea" size={size} />
        </Flexed>
      ))}
    </Spaced>
  ))
  .add('validations', () => (
    <Spaced>
      {['error', 'warn', 'valid', null].map((valid) => (
        <Flexed key={valid} label={String(valid)}>
          <Textarea defaultValue="textarea" size="100%" valid={valid} />
        </Flexed>
      ))}
    </Spaced>
  ))
  .add('alignment', () => (
    <Spaced>
      {['end', 'center', 'start'].map((align) => (
        <Flexed key={align} label={align}>
          <Textarea defaultValue="textarea" size="100%" align={align} />
        </Flexed>
      ))}
    </Spaced>
  ))
  .add('height', () => (
    <Spaced>
      {[100, 200, undefined].map((height) => (
        <Flexed key={(height || 'undefined').toString()} label={(height || 'undefined').toString()}>
          <Textarea
            defaultValue={[...new Array(650)].fill('textarea textvalue').join(' ')}
            size="100%"
            height={height}
          />
        </Flexed>
      ))}
    </Spaced>
  ));

storiesOf('Basics/Form/Input', module)
  .add('sizes', () => (
    <Spaced>
      {['auto', 'flex', '100%'].map((size) => (
        <Flexed key={size} label={size}>
          <Input defaultValue="text" size={size} />
        </Flexed>
      ))}
    </Spaced>
  ))
  .add('validations', () => (
    <Spaced>
      {['error', 'warn', 'valid', null].map((valid) => (
        <Flexed key={valid} label={String(valid)}>
          <Input defaultValue="text" size="100%" valid={valid} />
        </Flexed>
      ))}
    </Spaced>
  ))
  .add('alignment', () => (
    <Spaced>
      {['end', 'center', 'start'].map((align) => (
        <Flexed key={align} label={align}>
          <Input defaultValue="text" size="100%" align={align} />
        </Flexed>
      ))}
    </Spaced>
  ));

storiesOf('Basics/Form/NumericInput', module)
  .add('sizes', () => {
    const [auto, setAuto] = useState(0);
    const [flex, setFlex] = useState(0);
    const [full, setFull] = useState(0);
    const [content, setContent] = useState(0);
    return (
      <Spaced>
        {[
          { size: 'auto', value: auto, onChange: setAuto },
          { size: 'flex', value: flex, onChange: setFlex },
          { size: '100%', value: full, onChange: setFull },
          { size: 'content', value: content, onChange: setContent },
        ].map(({ size, value, onChange }) => (
          <Flexed key={size} label={size}>
            <NumericInput value={value} onChange={onChange} size={size} />
          </Flexed>
        ))}
      </Spaced>
    );
  })
  .add('validations', () => {
    const [error, setError] = useState(0);
    const [warn, setWarn] = useState(0);
    const [validity, setValidity] = useState(0);
    const [nullState, setNull] = useState(0);
    return (
      <Spaced>
        {[
          { valid: 'error', value: error, onChange: setError },
          { valid: 'warn', value: warn, onChange: setWarn },
          { valid: 'valid', value: validity, onChange: setValidity },
          { valid: null, value: nullState, onChange: setNull },
        ].map(({ valid, value, onChange }) => (
          <Flexed key={valid} label={String(valid)}>
            <NumericInput value={value} onChange={onChange} size="100%" valid={valid} />
          </Flexed>
        ))}
      </Spaced>
    );
  })
  .add('alignment', () => {
    const [end, setEnd] = useState(0);
    const [center, setCenter] = useState(0);
    const [start, setStart] = useState(0);
    return (
      <Spaced>
        {[
          { align: 'end', value: end, onChange: setEnd },
          { align: 'center', value: center, onChange: setCenter },
          { align: 'start', value: start, onChange: setStart },
        ].map(({ align, value, onChange }) => (
          <Flexed key={align} label={align}>
            <NumericInput value={value} onChange={onChange} size="100%" align={align} />
          </Flexed>
        ))}
      </Spaced>
    );
  });
