import { useDOMRect } from '@storybook/addons';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { TrackHorizontal } from './components/TrackHorizontal';
import { TrackVertical } from './components/TrackVertical';
import {
  SLIDER_DEFAULT_FADEOUT,
  SLIDER_DEFAULT_OPACITY,
  SLIDER_DEFAULT_PADDING,
  SLIDER_DEFAULT_SIZE,
} from './const';
import * as Styled from './styled';
import { ScrollAreaProps, ScrollAreaState, ScrollAreaStateItem } from './types';
import { getHorizontalState } from './utils/get-horiztontal-state';
import { getVerticalState } from './utils/get-vertical-state';

export const ScrollArea: FC<ScrollAreaProps> = ({
  absolute,
  children,
  horizontal: enableHorizontal = true,
  horizontalPosition = 'bottom',
  showOn = 'hover',
  sliderColor,
  sliderFadeout = SLIDER_DEFAULT_FADEOUT,
  sliderOpacity = SLIDER_DEFAULT_OPACITY,
  sliderPadding = SLIDER_DEFAULT_PADDING,
  sliderSize = SLIDER_DEFAULT_SIZE,
  sliderType,
  vertical: enableVertical = true,
  verticalPosition = 'right',
  onScroll,
  contentProps = {},
  containerProps = {},
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef({ i: 0, left: 0, top: 0 });
  const { ref: outerRef, rect: outerRect } = useDOMRect({ live: true });
  const { ref: innerRef, rect: innerRect } = useDOMRect({ live: true });

  const [state, setState] = useState<ScrollAreaState>({
    vertical: {
      enabled: enableVertical,
      show: showOn === 'always',
      slider: { position: 0, size: 0 },
      track: { size: 0, left: 0, top: 0 },
    },
    horizontal: {
      enabled: enableHorizontal,
      show: showOn === 'always',
      slider: { position: 0, size: 0 },
      track: { size: 0, left: 0, top: 0 },
    },
  });

  const handleChanges = useCallback(() => {
    let horizontal: ScrollAreaStateItem = { ...state.horizontal };
    let vertical: ScrollAreaStateItem = { ...state.vertical };
    const allowVertical = innerRect.height > outerRect.height && enableVertical;
    const allowHorizontal = innerRect.width > outerRect.width && enableHorizontal;

    scrollRef.current.top = outerRef ? outerRef.current.scrollTop : 0;
    scrollRef.current.left = outerRef ? outerRef.current.scrollLeft : 0;

    if (allowVertical) {
      vertical = {
        ...state.vertical,
        ...getVerticalState({
          enableHorizontal: allowHorizontal,
          enableVertical,
          horizontalPosition,
          innerRect,
          outerRect,
          scrollTop: outerRef.current.scrollTop,
          sliderPadding,
          sliderSize,
          verticalPosition,
        }),
      };
    } else {
      vertical = { ...vertical, enabled: false };
    }

    if (allowHorizontal) {
      horizontal = {
        ...state.horizontal,
        ...getHorizontalState({
          enableHorizontal,
          enableVertical: allowVertical,
          horizontalPosition,
          innerRect,
          outerRect,
          scrollLeft: outerRef.current.scrollLeft,
          sliderPadding,
          sliderSize,
          verticalPosition,
        }),
      };
    } else {
      horizontal = { ...horizontal, enabled: false };
    }

    setState({ ...state, horizontal, vertical });
  }, [
    state,
    setState,
    innerRect,
    outerRect,
    enableVertical,
    enableHorizontal,
    scrollRef,
    horizontalPosition,
    verticalPosition,
    sliderPadding,
    sliderSize,
  ]);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const { scrollLeft, scrollTop } = event.currentTarget;
      const oldScrollRef = scrollRef.current.i;
      scrollRef.current.i += 1;

      const oldScrollLeft = scrollRef.current.left;
      const oldScrollTop = scrollRef.current.top;
      scrollRef.current.top = scrollTop;
      scrollRef.current.left = scrollLeft;

      const verticalScrollChange = scrollTop !== oldScrollTop;
      const horizontalScrollChange = scrollLeft !== oldScrollLeft;

      const allowVertical = innerRect.height > outerRect.height && enableVertical;
      const allowHorizontal = innerRect.width > outerRect.width && enableHorizontal;

      setState({
        ...state,
        horizontal: {
          ...state.horizontal,
          ...getHorizontalState({
            enableHorizontal,
            enableVertical: allowVertical,
            horizontalPosition,
            innerRect,
            outerRect,
            scrollLeft,
            sliderPadding,
            sliderSize,
            verticalPosition,
          }),
          show: showOn === 'scroll' ? horizontalScrollChange : state.horizontal.show,
        },
        vertical: {
          ...state.vertical,
          ...getVerticalState({
            enableHorizontal: allowHorizontal,
            enableVertical,
            horizontalPosition,
            innerRect,
            outerRect,
            scrollTop,
            sliderPadding,
            sliderSize,
            verticalPosition,
          }),
          show: showOn === 'scroll' ? verticalScrollChange : state.vertical.show,
        },
      });

      if (onScroll) {
        event.persist();
        onScroll(event);
      }

      if (showOn === 'scroll') {
        setTimeout(() => {
          if (oldScrollRef + 1 === scrollRef.current.i) {
            scrollRef.current.i = 0;
            setState({
              ...state,
              horizontal: { ...state.horizontal, show: false },
              vertical: { ...state.vertical, show: false },
            });
          }
        }, sliderFadeout);
      }
    },
    [
      enableHorizontal,
      enableVertical,
      getHorizontalState,
      getVerticalState,
      horizontalPosition,
      innerRect,
      outerRect,
      outerRef,
      setState,
      showOn,
      sliderFadeout,
      sliderPadding,
      sliderSize,
      state,
      verticalPosition,
    ]
  );

  const handleMouseEnter = useCallback(() => {
    if (showOn === 'hover') {
      setState({
        ...state,
        horizontal: { ...state.horizontal, show: true },
        vertical: { ...state.vertical, show: true },
      });
    }
  }, [rest, showOn, state, setState]);

  const handleMouseLeave = useCallback(() => {
    if (showOn === 'hover') {
      setState({
        ...state,
        horizontal: { ...state.horizontal, show: false },
        vertical: { ...state.vertical, show: false },
      });
    }
  }, [rest]);

  const handleVerticalDrag = useCallback(
    (scrollTop: number) => {
      containerRef.current.scrollTo({ top: scrollTop, left: containerRef.current.scrollLeft });
    },
    [containerRef]
  );

  const handleHorizontalDrag = useCallback(
    (scrollLeft: number) => {
      containerRef.current.scrollTo({ top: containerRef.current.scrollTop, left: scrollLeft });
    },
    [containerRef]
  );

  // Get initial scroll position once outerRef and innerRef are not null
  useEffect(() => {
    if (outerRef !== null && outerRef.current && innerRef !== null && innerRef.current) {
      handleChanges();
    }
  }, [outerRef, innerRef]);

  // Get new state in case the dimensions of either inner or outer changes
  useEffect(() => {
    handleChanges();
  }, [innerRect, outerRect]);

  // Make sure we can handle new props coming from the outside without problems
  useEffect(() => {
    handleChanges();
  }, [
    enableHorizontal,
    enableVertical,
    horizontalPosition,
    verticalPosition,
    sliderSize,
    sliderPadding,
    sliderOpacity,
    sliderFadeout,
    showOn,
  ]);

  let child = children;

  if (children instanceof Function) {
    child = children({
      inner: innerRect,
      outer: outerRect,
      scroll: { left: scrollRef.current.left, top: scrollRef.current.top },
    });
  }

  return (
    <Styled.Wrapper data-sb-scrollarea="" absolute={absolute} {...rest} ref={outerRef}>
      <Styled.ScrollableContainer
        data-sb-scrollarea-container=""
        tabIndex={0}
        absolute={absolute}
        parentWidth={outerRect.width}
        parentHeight={outerRect.height}
        ref={containerRef}
        {...containerProps}
        onScroll={handleScroll}
        onMouseOver={handleMouseEnter}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Styled.ScrollableContent
          data-sb-scrollarea-content=""
          ref={innerRef}
          absolute={absolute}
          {...contentProps}
        >
          {child}
        </Styled.ScrollableContent>
      </Styled.ScrollableContainer>
      <TrackVertical
        state={state.vertical}
        sliderColor={sliderColor}
        sliderType={sliderType}
        sliderSize={sliderSize}
        showOn={showOn}
        sliderPadding={sliderPadding}
        sliderOpacity={sliderOpacity}
        maxScroll={innerRect.height - outerRect.height}
        onDrag={handleVerticalDrag}
        onMouseOver={handleMouseEnter}
        onMouseOut={handleMouseLeave}
      />
      <TrackHorizontal
        state={state.horizontal}
        sliderColor={sliderColor}
        sliderType={sliderType}
        sliderSize={sliderSize}
        showOn={showOn}
        sliderPadding={sliderPadding}
        sliderOpacity={sliderOpacity}
        maxScroll={innerRect.width - outerRect.width}
        onDrag={handleHorizontalDrag}
        onMouseOver={handleMouseEnter}
        onMouseOut={handleMouseLeave}
      />
    </Styled.Wrapper>
  );
};
