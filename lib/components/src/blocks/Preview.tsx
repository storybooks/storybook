import React, { Children, FunctionComponent, ReactElement, ReactNode, useState } from 'react';
import { styled } from '@storybook/theming';

import { getBlockBackgroundStyle } from './BlockBackgroundStyles';
import { Source, SourceProps } from './Source';
import { ActionBar, ActionItem } from '../ActionBar/ActionBar';
import { Toolbar } from './Toolbar';
import { ZoomContext } from './ZoomContext';
import { Zoom } from '../Zoom/Zoom';

export interface PreviewProps {
  isColumn?: boolean;
  columns?: number;
  withSource?: SourceProps;
  isExpanded?: boolean;
  withToolbar?: boolean;
  className?: string;
  additionalActions?: ActionItem[];
}

type layout = 'padded' | 'fullscreen' | 'centered';

const ChildrenContainer = styled.div<PreviewProps & { layout: layout }>(
  ({ isColumn, columns, layout }) => ({
    display: isColumn || !columns ? 'block' : 'flex',
    position: 'relative',
    flexWrap: 'wrap',
    overflow: 'auto',
    flexDirection: isColumn ? 'column' : 'row',

    '& .innerZoomElementWrapper > *': isColumn
      ? {
          width: layout !== 'fullscreen' ? 'calc(100% - 20px)' : '100%',
          display: 'block',
        }
      : {
          maxWidth: layout !== 'fullscreen' ? 'calc(100% - 20px)' : '100%',
          display: 'inline-block',
        },
  }),
  ({ layout = 'padded' }) =>
    layout === 'centered' || layout === 'padded'
      ? {
          padding: '30px 20px',
          margin: -10,
          '& .innerZoomElementWrapper > *': {
            width: 'auto',
            border: '10px solid transparent!important',
          },
        }
      : {},
  ({ layout = 'padded' }) =>
    layout === 'centered'
      ? {
          display: 'flex',
          justifyContent: 'center',
          justifyItems: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }
      : {},
  ({ columns }) =>
    columns && columns > 1
      ? { '.innerZoomElementWrapper > *': { minWidth: `calc(100% / ${columns} - 20px)` } }
      : {}
);

const StyledSource = styled(Source)<SourceProps>(({ theme }) => ({
  margin: 0,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  borderBottomLeftRadius: theme.appBorderRadius,
  borderBottomRightRadius: theme.appBorderRadius,
  border: 'none',
  borderTopWidth: 1,
  borderTopStyle: 'solid',
  borderTopColor: theme.color.border,
}));

const PreviewContainer = styled.div<PreviewProps>(
  ({ theme, withSource, isExpanded }) => ({
    position: 'relative',
    overflow: 'hidden',
    margin: '25px 0 40px',
    ...getBlockBackgroundStyle(theme),
    borderBottomLeftRadius: withSource && isExpanded && 0,
    borderBottomRightRadius: withSource && isExpanded && 0,
    borderBottomWidth: isExpanded && 0,
  }),
  ({ withToolbar }) => withToolbar && { paddingTop: 40 }
);

interface SourceItem {
  source?: ReactElement;
  actionItem: ActionItem;
}

const getSource = (
  withSource: SourceProps,
  expanded: boolean,
  setExpanded: Function
): SourceItem => {
  switch (true) {
    case !!(withSource && withSource.error): {
      return {
        source: null,
        actionItem: {
          title: 'No code available',
          disabled: true,
          onClick: () => setExpanded(false),
        },
      };
    }
    case expanded: {
      return {
        source: <StyledSource {...withSource} />,
        actionItem: { title: 'Hide code', onClick: () => setExpanded(false) },
      };
    }
    default: {
      return {
        source: null,
        actionItem: { title: 'Show code', onClick: () => setExpanded(true) },
      };
    }
  }
};
function getStoryId(children: ReactNode) {
  if (Children.count(children) === 1) {
    const elt = children as ReactElement;
    if (elt.props) {
      return elt.props.id;
    }
  }
  return null;
}

const PositionedToolbar = styled(Toolbar)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 40,
});

const Relative = styled.div({
  overflow: 'hidden',
  position: 'relative',
});

const getLayout = (children: ReactElement[]): layout => {
  return children.reduce((result, c) => {
    if (result) {
      return result;
    }
    if (typeof c === 'string' || typeof c === 'number') {
      return 'padded';
    }
    return (c.props && c.props.parameters && c.props.parameters.layout) || 'padded';
  }, undefined);
};

/**
 * A preview component for showing one or more component `Story`
 * items. The preview also shows the source for the component
 * as a drop-down.
 */
const Preview: FunctionComponent<PreviewProps> = ({
  isColumn,
  columns,
  children,
  withSource,
  withToolbar = false,
  isExpanded = false,
  additionalActions,
  className,
  ...props
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const { source, actionItem } = getSource(withSource, expanded, setExpanded);
  const [scale, setScale] = useState(1);
  const previewClasses = [className].concat(['sbdocs', 'sbdocs-preview']);

  const defaultActionItems = withSource ? [actionItem] : [];
  const actionItems = additionalActions
    ? [...defaultActionItems, ...additionalActions]
    : defaultActionItems;

  // @ts-ignore
  const layout = getLayout(Children.count(children) === 1 ? [children] : children);

  return (
    <PreviewContainer
      {...{ withSource, withToolbar }}
      {...props}
      className={previewClasses.join(' ')}
    >
      {withToolbar && (
        <PositionedToolbar
          border
          zoom={(z) => setScale(scale * z)}
          resetZoom={() => setScale(1)}
          storyId={getStoryId(children)}
          baseUrl="./iframe.html"
        />
      )}
      <ZoomContext.Provider value={{ scale }}>
        <Relative className="docs-story">
          <ChildrenContainer
            isColumn={isColumn || !Array.isArray(children)}
            columns={columns}
            layout={layout}
          >
            <Zoom.Element scale={scale}>
              {Array.isArray(children) ? (
                // eslint-disable-next-line react/no-array-index-key
                children.map((child, i) => <div key={i}>{child}</div>)
              ) : (
                <div>{children}</div>
              )}
            </Zoom.Element>
          </ChildrenContainer>
          <ActionBar actionItems={actionItems} />
        </Relative>
      </ZoomContext.Provider>
      {withSource && source}
    </PreviewContainer>
  );
};

export { Preview };
