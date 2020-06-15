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
  const rows = componentDoc.attributes.arguments.map((prop) => {
    const required = prop.tags.length ? prop.tags.some((tag) => tag.name === 'required') : false;
    return {
      name: prop.name,
      description: prop.description,
      required,
      defaultValue: prop.defaultValue,
      table: {
        type: {
          summary: prop.type,
          required,
        },
      },
    };
  });
  return { rows };
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
