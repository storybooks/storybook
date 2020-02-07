import { isNil } from 'lodash';
import { PropDef } from '@storybook/components';
import { ExtractedProp } from '../../../lib/docgen';
import { createType } from './createType';
import { createDefaultValue, createDefaultValueFromRawDefaultProp } from '../lib/defaultValues';
import { Component } from '../../../blocks/shared';
import { keepOriginalDefinitionOrder } from './sortProps';
import { rawDefaultPropTypeResolvers } from './rawDefaultPropResolvers';

export function enhancePropTypesProp(extractedProp: ExtractedProp, rawDefaultProp?: any): PropDef {
  const { propDef } = extractedProp;

  const newtype = createType(extractedProp);
  if (!isNil(newtype)) {
    propDef.type = newtype;
  }

  const { defaultValue } = extractedProp.docgenInfo;
  if (!isNil(defaultValue) && !isNil(defaultValue.value)) {
    const newDefaultValue = createDefaultValue(defaultValue.value);

    if (!isNil(newDefaultValue)) {
      propDef.defaultValue = newDefaultValue;
    }
  } else if (!isNil(rawDefaultProp)) {
    const newDefaultValue = createDefaultValueFromRawDefaultProp(
      rawDefaultProp,
      propDef,
      rawDefaultPropTypeResolvers
    );

    if (!isNil(newDefaultValue)) {
      propDef.defaultValue = newDefaultValue;
    }
  }
  // typescript information for types inheritance
  propDef.parent = extractedProp.docgenInfo.parent;

  return propDef;
}

export function enhancePropTypesProps(
  extractedProps: ExtractedProp[],
  component: Component
): PropDef[] {
  const rawDefaultProps = !isNil(component.defaultProps) ? component.defaultProps : {};
  const enhancedProps = extractedProps.map(x =>
    enhancePropTypesProp(x, rawDefaultProps[x.propDef.name])
  );

  return keepOriginalDefinitionOrder(enhancedProps, component);
}
