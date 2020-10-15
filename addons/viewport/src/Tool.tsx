/* eslint-disable no-fallthrough */
import React, {
  Fragment,
  ReactNode,
  useEffect,
  useRef,
  FunctionComponent,
  memo,
  useState,
} from 'react';
import memoize from 'memoizerific';
import { useDebouncedCallback } from 'use-debounce';

import { styled, Global, Theme, withTheme } from '@storybook/theming';

import { Icons, IconButton, WithTooltip, TooltipLinkList, Form } from '@storybook/components';

import { useParameter, useAddonState } from '@storybook/api';
import { PARAM_KEY, ADDON_ID } from './constants';
import { MINIMAL_VIEWPORTS } from './defaults';
import { ViewportAddonParameter, ViewportMap, ViewportStyles, Styles, Viewport } from './models';

interface ViewportItem {
  id: string;
  title: string;
  styles: Styles;
  type: 'desktop' | 'mobile' | 'tablet' | 'other';
  default?: boolean;
}

const toList = memoize(50)((items: ViewportMap): ViewportItem[] => [
  ...baseViewports,
  ...Object.entries(items).map(([id, { name, ...rest }]) => ({ ...rest, id, title: name })),
]);

const resetViewport: ViewportItem = {
  id: 'reset',
  title: 'Reset viewport',
  styles: null,
  type: 'other',
};

const responsiveViewport: ViewportItem = {
  id: 'responsive',
  title: 'Responsive',
  styles: (prevStyles) => {
    return prevStyles;
  },
  type: 'other',
};

const baseViewports: ViewportItem[] = [resetViewport, responsiveViewport];

const toLinks = memoize(50)((list: ViewportItem[], active: LinkBase, set, state, close): Link[] => {
  return list
    .map((i) => {
      switch (i.id) {
        case resetViewport.id: {
          if (active.id === i.id) {
            return null;
          }
        }
        default: {
          return {
            ...i,
            onClick: () => {
              set({ ...state, selected: i.id });
              close();
            },
          };
        }
      }
    })
    .filter(Boolean);
});

const iframeId = 'storybook-preview-iframe';
const wrapperId = 'storybook-preview-wrapper';

interface LinkBase {
  id: string;
  title: string;
  right?: ReactNode;
  type: 'desktop' | 'mobile' | 'tablet' | 'other';
  styles: ViewportStyles | ((s: ViewportStyles) => ViewportStyles) | null;
}

interface Link extends LinkBase {
  onClick: () => void;
}

const flip = ({ width, height, ...styles }: ViewportStyles) => ({
  ...styles,
  height: width,
  width: height,
});

const ActiveViewportSize = styled.div(() => ({
  display: 'inline-flex',
}));

const ActiveViewportNumericInput = styled(Form.NumericInput)(() => ({
  flexGrow: 0,
  alignSelf: 'center',
  padding: '2px 2px 2px 6px',
}));

const ActiveViewportIconButton = styled(IconButton)(() => ({
  margin: '0 10px',
}));

const IconButtonWithLabel = styled(IconButton)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
}));

const IconButtonLabel = styled.div<{}>(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
  marginLeft: 10,
}));

interface ViewportToolState {
  isRotated: boolean;
  selected: string | null;
  width: number;
  height: number;
}

const getSizeFromStyles = (
  styles: ViewportStyles,
  state: ViewportToolState
): { width: number; height: number } => {
  let { width, height } = state;
  if (styles) {
    if (styles.width) {
      const w = parseInt(styles.width.replace('px', ''), 10);
      if (!Number.isNaN(w)) {
        width = w;
      }
    }
    if (styles.height) {
      const h = parseInt(styles.height.replace('px', ''), 10);
      if (!Number.isNaN(h)) {
        height = h;
      }
    }
  }
  return { width, height };
};

const getStyles = (
  prevStyles: ViewportStyles,
  styles: Styles,
  state: ViewportToolState
): ViewportStyles => {
  if (styles === null) {
    return null;
  }
  const newStyles = typeof styles === 'function' ? styles(prevStyles) : styles;
  const result = { ...newStyles };
  if (state.selected === responsiveViewport.id) {
    result.width = state.width > 0 ? `${state.width}px` : '100%';
    result.height = state.height > 0 ? `${state.height}px` : '100%';
  }
  return state.isRotated ? flip(result) : result;
};

const getItem = (list: ViewportItem[], selected: string, defaultViewport: string) => {
  return (
    list.find((i) => i.id === selected) ||
    list.find((i) => i.id === defaultViewport) ||
    list.find((i) => i.default) ||
    resetViewport
  );
};

const getSize = (
  list: ViewportItem[],
  defaultViewport: string,
  state: ViewportToolState,
  prevStyles: ViewportStyles
): { width: number; height: number } => {
  const item = getItem(list, state.selected, defaultViewport);
  const styles = getStyles(prevStyles, item.styles, state);
  if (item.id === responsiveViewport.id) {
    return {
      width: state.width,
      height: state.height,
    };
  }
  return getSizeFromStyles(styles, state);
};

export const ViewportTool: FunctionComponent = memo(
  withTheme(({ theme }: { theme: Theme }) => {
    const {
      viewports = MINIMAL_VIEWPORTS,
      defaultViewport = resetViewport.id,
      disable,
    } = useParameter<ViewportAddonParameter>(PARAM_KEY, {});
    const [state, setStateRaw] = useAddonState<ViewportToolState>(ADDON_ID, {
      selected: defaultViewport,
      isRotated: false,
      width: 0,
      height: 0,
    });
    const setStateDebounced = useDebouncedCallback(setStateRaw, 100);

    // Store width/height locally so we can debounce the main state, but still
    // have responsive inputs.
    const [localWidth, _setLocalWidth] = useState(state.width);
    const [localHeight, _setLocalHeight] = useState(state.height);

    const list = toList(viewports);
    const ref = useRef<ViewportStyles>();

    const setState = (newState: ViewportToolState) => {
      const { width, height } = getSize(list, defaultViewport, newState, ref.current);
      const updatedState = {
        ...newState,
        width,
        height,
      };
      _setLocalWidth(width);
      _setLocalHeight(height);
      setStateDebounced.callback(updatedState);
    };

    if (!list.find((i) => i.id === defaultViewport)) {
      console.warn(
        `Cannot find "defaultViewport" of "${defaultViewport}" in addon-viewport configs, please check the "viewports" setting in the configuration.`
      );
    }

    useEffect(() => {
      setState({
        selected:
          defaultViewport || (viewports[state.selected] ? state.selected : resetViewport.id),
        isRotated: state.isRotated,
        width: state.width,
        height: state.height,
      });
    }, [defaultViewport]);

    const { selected, isRotated, width, height } = state;

    const item = getItem(list, selected, defaultViewport);

    const styles = getStyles(ref.current, item.styles, state);
    useEffect(() => {
      ref.current = styles;
    }, [item]);

    if (disable || Object.entries(viewports).length === 0) {
      return null;
    }

    const isReset = selected === resetViewport.id;
    const isResponsive = selected === responsiveViewport.id;

    let viewportLabel: string;
    if (!isResponsive) {
      viewportLabel = isRotated ? `${item.title} (L)` : `${item.title} (P)`;
    } else {
      viewportLabel = item.title;
    }

    return (
      <Fragment>
        <WithTooltip
          placement="top"
          trigger="click"
          tooltip={({ onHide }) => (
            <TooltipLinkList links={toLinks(list, item, setState, state, onHide)} />
          )}
          closeOnClick
        >
          <IconButtonWithLabel
            key="viewport"
            title="Change the size of the preview"
            active={!!styles}
            onDoubleClick={() => {
              setState({ ...state, selected: resetViewport.id });
            }}
          >
            <Icons icon="grow" />
            {styles ? <IconButtonLabel>{viewportLabel}</IconButtonLabel> : null}
          </IconButtonWithLabel>
        </WithTooltip>

        {!isReset && styles && (
          <ActiveViewportSize>
            <Global
              styles={{
                [`#${iframeId}`]: {
                  margin: `auto`,
                  transition: 'width .3s, height .3s',
                  position: 'relative',
                  border: `1px solid black`,
                  boxShadow:
                    '0 0 100px 1000px rgba(0,0,0,0.5), 0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)',
                  ...styles,
                },
                [`#${wrapperId}`]: {
                  padding: theme.layoutMargin,
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  justifyItems: 'center',
                  overflow: 'auto',

                  display: 'grid',
                  gridTemplateColumns: '100%',
                  gridTemplateRows: '100%',
                },
              }}
            />
            <ActiveViewportNumericInput
              title="Viewport width"
              value={localWidth}
              onChange={(value: number) =>
                setState({ ...state, width: value, selected: responsiveViewport.id })
              }
              size="content"
            />
            <ActiveViewportIconButton
              key="viewport-rotate"
              title="Rotate viewport"
              onClick={() => {
                setState({ ...state, isRotated: !isRotated });
              }}
            >
              <Icons icon="transfer" />
            </ActiveViewportIconButton>
            <ActiveViewportNumericInput
              title="Viewport height"
              value={localHeight}
              onChange={(value: number) =>
                setState({ ...state, height: value, selected: responsiveViewport.id })
              }
              size="content"
            />
          </ActiveViewportSize>
        )}
      </Fragment>
    );
  })
);
