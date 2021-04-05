import React, { Component, ChangeEvent, Validator } from 'react';
import PropTypes from 'prop-types';
import { dequal } from 'dequal/lite';
import { polyfill } from 'react-lifecycles-compat';
import { Form } from '@storybook/components';
import { KnobControlConfig, KnobControlProps } from './types';

export type ObjectTypeKnob<T> = KnobControlConfig<T>;
type ObjectTypeProps<T> = KnobControlProps<T>;

interface ObjectTypeState<T> {
  value: string;
  failed: boolean;
  json?: T;
}

class ObjectType<T> extends Component<ObjectTypeProps<T>> {
  static propTypes = {
    knob: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    }).isRequired as Validator<ObjectTypeProps<any>['knob']>,
    onChange: PropTypes.func.isRequired as Validator<ObjectTypeProps<any>['onChange']>,
  };

  static defaultProps: ObjectTypeProps<any> = {
    knob: {} as any,
    onChange: (value) => value,
  };

  static serialize: { <T>(object: T): string } = (object) => JSON.stringify(object);

  static deserialize: { <T>(value: string): T } = (value) => (value ? JSON.parse(value) : {});

  static getDerivedStateFromProps<T>(
    props: ObjectTypeProps<T>,
    state: ObjectTypeState<T>
  ): ObjectTypeState<T> | null {
    if (!dequal(props.knob.value, state.json)) {
      try {
        return {
          value: JSON.stringify(props.knob.value, null, 2),
          failed: false,
          json: props.knob.value,
        };
      } catch (e) {
        return { value: 'Object cannot be stringified', failed: true };
      }
    }
    return null;
  }

  state: ObjectTypeState<T> = {
    value: '',
    failed: false,
    json: {} as any,
  };

  handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    const { json: stateJson } = this.state;
    const { knob, onChange } = this.props;

    try {
      const json = JSON.parse(value.trim());
      this.setState({
        value,
        json,
        failed: false,
      });
      if (dequal(knob.value, stateJson)) {
        onChange(json);
      }
    } catch (err) {
      this.setState({
        value,
        failed: true,
      });
    }
  };

  render() {
    const { value, failed } = this.state;
    const { knob } = this.props;

    return (
      <Form.Textarea
        name={knob.name}
        valid={failed ? 'error' : undefined}
        value={value}
        onChange={this.handleChange}
        size="flex"
      />
    );
  }
}

polyfill(ObjectType as any);

export default ObjectType;
