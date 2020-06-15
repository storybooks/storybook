import { ArgTypes } from '@storybook/api';
import { ArgTypesExtractor, hasDocgen, extractComponentProps } from '../../lib/docgen';
import { convert } from '../../lib/sbtypes';
import { trimQuotes } from '../../lib/sbtypes/utils';

const SECTIONS = ['props', 'events', 'slots'];

const trim = (val: any) => (val && typeof val === 'string' ? trimQuotes(val) : val);

export const extractArgTypes: ArgTypesExtractor = (component) => {
  if (!hasDocgen(component)) {
    return null;
  }
  const results: ArgTypes = {};
  SECTIONS.forEach((section) => {
    const props = extractComponentProps(component, section);
    props.forEach(({ propDef, docgenInfo, jsDocTags }) => {
      const { name, type, description, defaultValue, required } = propDef;
      const sbType = section === 'props' ? convert(docgenInfo) : { name: 'void' };
      results[name] = {
        name,
        description,
        type: { required, ...sbType },
        required,
        defaultValue: defaultValue && trim(defaultValue.detail || defaultValue.summary),
        table: {
          category: section,
          type,
          jsDocTags,
          defaultValue,
        },
      };
    });
  });
  return results;
};
