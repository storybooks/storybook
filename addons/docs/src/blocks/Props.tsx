import React, { FunctionComponent, useContext } from 'react';
import { isNil } from 'lodash';

import {
  PropsTable,
  PropsTableError,
  PropsTableProps,
  PropsTableSectionsProps,
  PropRowsProps,
  PropDef,
  TabsState,
} from '@storybook/components';
import { DocsContext, DocsContextProps } from './DocsContext';
import { Component, PropsSlot, CURRENT_SELECTION } from './shared';
import { getComponentName } from './utils';

import { PropsExtractor } from '../lib/docgen/types';
import { extractProps as reactExtractProps } from '../frameworks/react/extractProps';
import { extractProps as vueExtractProps } from '../frameworks/vue/extractProps';

interface PropsProps {
  exclude?: string[];
  of?: '.' | Component;
  components?: {
    [label: string]: Component;
  };
  slot?: PropsSlot;
}

// FIXME: remove in SB6.0 & require config
const inferPropsExtractor = (framework: string): PropsExtractor | null => {
  switch (framework) {
    case 'react':
      return reactExtractProps;
    case 'vue':
      return vueExtractProps;
    default:
      return null;
  }
};

const filterRows = (rows: PropDef[], exclude: string[]) =>
  rows && rows.filter((row: PropDef) => !exclude.includes(row.name));

export const getComponentProps = (
  component: Component,
  { exclude }: PropsProps,
  { parameters }: DocsContextProps
): PropsTableProps | PropsTableSectionsProps => {
  if (!component) {
    return null;
  }
  try {
    const params = parameters || {};
    const { framework = null } = params;

    const { extractProps = inferPropsExtractor(framework) }: { extractProps: PropsExtractor } =
      params.docs || {};
    if (!extractProps) {
      throw new Error(PropsTableError.PROPS_UNSUPPORTED);
    }
    let props: PropsTableProps | PropsTableSectionsProps = extractProps(component);
    if (!isNil(exclude)) {
      const { rows } = props as PropRowsProps;
      const { sections } = props as PropsTableSectionsProps;
      if (rows) {
        props = { rows: filterRows(rows, exclude) };
      } else if (sections) {
        Object.keys(sections).forEach(section => {
          sections[section] = filterRows(sections[section], exclude);
        });
      }
    }
    if ((props as PropRowsProps).rows) {
      const propSections = (props as PropRowsProps).rows.reduce(
        (acc: { [key: string]: PropDef[] }, prop: PropDef) => {
          if (prop.parent && prop.parent.name) {
            if (!acc[prop.parent.name]) {
              return { ...acc, [prop.parent.name]: [prop] };
            }
            return { ...acc, [prop.parent.name]: [...acc[prop.parent.name], prop] };
          }
          return acc;
        },
        {}
      );
      const propSectionsArray = Object.keys(propSections);
      if (propSectionsArray.length > 1) {
        // the props are with sections (inherited interfaces in typescript)

        // find out what section is the components own props
        // by default just use the first listed interface of props
        let expanded: string[] = [propSectionsArray[0]];

        // if any section names contain the componnet name, expand them by default
        if (component.displayName) {
          // find all sections that contain the component name
          const nameMatch = propSectionsArray.filter(
            section => section.indexOf(component.displayName) >= 0
          );
          //
          if (nameMatch.length) {
            expanded = nameMatch;
          }
          // if any section have only 1 prop, expand them by default
          propSectionsArray.forEach(section => {
            if (propSections[section].length === 1 && expanded.indexOf(section) < 0) {
              expanded.push(section);
            }
          });
        }
        props = { sections: propSections, expanded };
      }
    }
    return props;
  } catch (err) {
    return { error: err.message };
  }
};

export const getComponent = (props: PropsProps = {}, context: DocsContextProps): Component => {
  const { of } = props;
  const { parameters = {} } = context;
  const { component } = parameters;

  const target = of === CURRENT_SELECTION ? component : of;
  if (!target) {
    if (of === CURRENT_SELECTION) {
      return null;
    }
    throw new Error(PropsTableError.NO_COMPONENT);
  }
  return target;
};

const PropsContainer: FunctionComponent<PropsProps> = props => {
  const context = useContext(DocsContext);
  const { slot, components } = props;
  const {
    parameters: { subcomponents },
  } = context;

  let allComponents = components;
  if (!allComponents) {
    const main = getComponent(props, context);
    const mainLabel = getComponentName(main);
    const mainProps = slot ? slot(context, main) : getComponentProps(main, props, context);

    if (!subcomponents || typeof subcomponents !== 'object') {
      return mainProps && <PropsTable {...mainProps} />;
    }

    allComponents = { [mainLabel]: main, ...subcomponents };
  }

  const tabs: { label: string; table: PropsTableProps }[] = [];
  Object.entries(allComponents).forEach(([label, component]) => {
    tabs.push({
      label,
      table: slot ? slot(context, component) : getComponentProps(component, props, context),
    });
  });

  return (
    <TabsState>
      {tabs.map(({ label, table }) => {
        if (!table) {
          return null;
        }
        const id = `prop_table_div_${label}`;
        return (
          <div key={id} id={id} title={label}>
            {({ active }: { active: boolean }) =>
              active ? <PropsTable key={`prop_table_${label}`} {...table} /> : null
            }
          </div>
        );
      })}
    </TabsState>
  );
};

PropsContainer.defaultProps = {
  of: '.',
};

export { PropsContainer as Props };
