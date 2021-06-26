import React, { FC, useCallback, useRef } from 'react';
import { document as _document } from 'global';
import * as Styled from '../styled';
import { ScrollAreaTrackProps } from '../types';

const document = _document as Document;

export const TrackVertical: FC<ScrollAreaTrackProps> = ({
  showOn,
  sliderColor,
  sliderSize,
  sliderType,
  sliderOpacity,
  sliderPadding,
  state,
  maxScroll,
  onDrag,
  onMouseOver,
  onMouseOut,
}) => {
  const dragRef = useRef(0);

  const handleDrag = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const delta = event.screenY - dragRef.current;

      const maxSliderPosition = state.track.size - state.slider.size;
      const currentSliderPosition = state.slider.position;
      const newSliderPosition = currentSliderPosition + delta;

      if (newSliderPosition > 0 && newSliderPosition <= maxSliderPosition) {
        const sliderRatio = newSliderPosition / maxSliderPosition;
        const scrollTop = sliderRatio * maxScroll;
        onDrag(scrollTop);
      }
    },
    [dragRef, state]
  );

  const dragEnd = useCallback(() => {
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', dragEnd);

    dragRef.current = 0;
  }, [handleDrag, dragRef]);

  const dragStart = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      dragRef.current = event.screenY;
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', dragEnd);
    },
    [handleDrag, dragEnd, dragRef]
  );

  return (
    state.enabled && (
      <Styled.VerticalTrack
        data-sb-scrollarea-track=""
        data-sb-scrollarea-track-vertical=""
        show={state.show}
        showOn={showOn}
        sliderOpacity={sliderOpacity}
        sliderPadding={sliderPadding}
        onMouseOver={onMouseOver}
        onMouseEnter={onMouseOver}
        onMouseLeave={onMouseOut}
        style={{
          left: state.track.left,
          top: state.track.top,
          height: state.track.size,
        }}
      >
        <Styled.VerticalSlider
          data-sb-scrollarea-slider=""
          data-sb-scrollarea-slider-vertical=""
          sliderColor={sliderColor}
          sliderSize={sliderSize}
          sliderType={sliderType}
          onMouseDown={dragStart}
          style={{
            transform: `translateY(${state.slider.position}px)`,
            height: state.slider.size,
          }}
        />
      </Styled.VerticalTrack>
    )
  );
};
