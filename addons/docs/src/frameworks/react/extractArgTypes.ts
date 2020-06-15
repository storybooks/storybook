import { ArgTypes } from '@storybook/api';
import { PropDef, ArgTypesExtractor } from '../../lib/docgen';
import { extractProps } from './extractProps';

export const extractArgTypes: ArgTypesExtractor = (component) => {
  if (component) {
    const { rows } = extractProps(component);
    if (rows) {
      return rows.reduce((acc: ArgTypes, row: PropDef) => {
        const { type, sbType, defaultValue: defaultSummary, jsDocTags, required } = row;
        let defaultValue = defaultSummary && (defaultSummary.detail || defaultSummary.summary);
        try {
          // eslint-disable-next-line no-eval
          defaultValue = eval(defaultValue);
          // eslint-disable-next-line no-empty
        } catch {}

        acc[row.name] = {
          ...row,
          type: { required, ...sbType },
          required,
          defaultValue,
          table: {
            type,
            jsDocTags,
            defaultValue: defaultSummary,
          },
        };
        return acc;
      }, {});
    }
  }

  return null;
};
