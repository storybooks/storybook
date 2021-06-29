import { getCustomElements, isValidComponent, isValidMetaData } from '@storybook/web-components';
import { ArgTypes } from '@storybook/api';
import { logger } from '@storybook/client-logger';

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
  methods?: TagItem[];
  slots?: TagItem[];
  cssProperties?: TagItem[];
  cssParts?: TagItem[];
}

interface CustomElements {
  tags: Tag[];
}

interface Sections {
  attributes?: any;
  properties?: any;
  events?: any;
  slots?: any;
  cssCustomProperties?: any;
  cssShadowParts?: any;
}

function mapData(data: TagItem[], category: string) {
  return (
    data &&
    data.reduce((acc, item) => {
      const type = category === 'properties' ? { name: item.type } : { name: 'void' };
      let { name } = item;
      if (category === 'slots' && name === '') {
        name = 'unnamed (default slot)';
      }
      acc[`${category}:${item.name}`] = {
        name,
        required: false,
        description: item.description,
        type,
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

const getMetaData = (tagName: string, customElements: CustomElements) => {
  if (!isValidComponent(tagName) || !isValidMetaData(customElements)) {
    return null;
  }
  const metaData = customElements.tags.find(
    (tag) => tag.name.toUpperCase() === tagName.toUpperCase()
  );
  if (!metaData) {
    logger.warn(`Component not found in custom-elements.json: ${tagName}`);
  }
  return metaData;
};

export const extractArgTypesFromElements = (tagName: string, customElements: CustomElements) => {
  const metaData = getMetaData(tagName, customElements);
  return (
    metaData && {
      ...mapData(metaData.attributes, 'attributes'),
      ...mapData(metaData.properties, 'properties'),
      ...mapData(metaData.events, 'events'),
      ...mapData(metaData.methods, 'methods'),
      ...mapData(metaData.slots, 'slots'),
      ...mapData(metaData.cssProperties, 'css custom properties'),
      ...mapData(metaData.cssParts, 'css shadow parts'),
    }
  );
};

export const extractArgTypes = (tagName: string) => {
  return extractArgTypesFromElements(tagName, getCustomElements());
};

export const extractComponentDescription = (tagName: string) => {
  const metaData = getMetaData(tagName, getCustomElements());
  return metaData && metaData.description;
};
