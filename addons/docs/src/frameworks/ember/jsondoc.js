/* eslint-disable no-underscore-dangle */
/* global window */

export const setJSONDoc = (jsondoc) => {
  window.__EMBER_GENERATED_DOC_JSON__ = jsondoc;
};
export const getJSONDoc = () => {
  return window.__EMBER_GENERATED_DOC_JSON__;
};

export const extractArgTypes = (componentName) => {
  const json = getJSONDoc();
  if (!(json && json.included)) {
    return null;
  }
  const componentDoc = json.included.find((doc) => doc.attributes.name === componentName);

  if (!componentDoc) {
    return null;
  }
  return componentDoc.attributes.arguments.reduce((acc, prop) => {
    acc[prop.name] = {
      name: prop.name,
      type: {
        name: prop.type,
        required: prop.tags.length ? prop.tags.some((tag) => tag.name === 'required') : false,
      },
      defaultValue: prop.defaultValue,
      description: prop.description,
      table: {
        defaultValue: { summary: prop.defaultValue },
        type: {
          summary: prop.type,
        },
      },
    };
    return acc;
  }, {});
};

export const extractComponentDescription = (componentName) => {
  const json = getJSONDoc();
  if (!(json && json.included)) {
    return null;
  }
  const componentDoc = json.included.find((doc) => doc.attributes.name === componentName);

  if (!componentDoc) {
    return null;
  }

  return componentDoc.attributes.description;
};
