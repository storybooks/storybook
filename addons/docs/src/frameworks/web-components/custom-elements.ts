/* eslint-disable import/no-extraneous-dependencies */
import { getCustomElements, isValidComponent, isValidMetaData } from '@storybook/web-components';
import { ArgTypes } from '@storybook/api';

interface TagItem {
  name: string;
  type: string;
  description: string;
  default?: any;
  defaultValue?: any;
}

interface Tag {
  name: string;
  description: string;
  attributes?: TagItem[];
  properties?: TagItem[];
  events?: TagItem[];
  slots?: TagItem[];
  cssProperties?: TagItem[];
}

interface CustomElements {
  tags: Tag[];
}

interface Sections {
  attributes?: any;
  properties?: any;
  events?: any;
  slots?: any;
  css?: any;
}

function mapData(data: TagItem[], category: string) {
  return (
    data &&
    data.reduce((acc, item) => {
      const type = category === 'properties' ? { name: item.type } : { name: 'void' };
      acc[item.name] = {
        name: item.name,
        description: item.description,
        type,
        required: false,
        table: {
          category,
          type: { summary: item.type },
          defaultValue: { summary: item.default !== undefined ? item.default : item.defaultValue },
        },
      };
      return acc;
    }, {} as ArgTypes)
  );
}

function isEmpty(obj: object) {
  return Object.entries(obj).length === 0 && obj.constructor === Object;
}

export const extractArgTypesFromElements = (tagName: string, customElements: CustomElements) => {
  if (!isValidComponent(tagName) || !isValidMetaData(customElements)) {
    return null;
  }
  const metaData = customElements.tags.find(
    (tag) => tag.name.toUpperCase() === tagName.toUpperCase()
  );
  const argTypes = {
    ...mapData(metaData.attributes, 'attributes'),
    ...mapData(metaData.properties, 'properties'),
    ...mapData(metaData.events, 'events'),
    ...mapData(metaData.slots, 'slots'),
    ...mapData(metaData.cssProperties, 'css'),
  };
  return argTypes;
};

export const extractArgTypes = (tagName: string) => {
  const customElements: CustomElements = getCustomElements();
  return extractArgTypesFromElements(tagName, customElements);
};

export const extractComponentDescription = (tagName: string) => {
  const customElements: CustomElements = getCustomElements();
  if (!isValidComponent(tagName) || !isValidMetaData(customElements)) {
    return null;
  }
  const metaData = customElements.tags.find(
    (tag) => tag.name.toUpperCase() === tagName.toUpperCase()
  );
  return metaData && metaData.description;
};
