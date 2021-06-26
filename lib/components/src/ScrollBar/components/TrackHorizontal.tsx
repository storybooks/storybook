import React, { FC, useCallback, useRef } from 'react';
import { document as _document } from 'global';
import * as Styled from '../styled';
import { ScrollAreaTrackProps } from '../types';

const document = _document as Document;

export const TrackHorizontal: FC<ScrollAreaTrackProps> = ({
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

      const delta = event.screenX - dragRef.current;

      const maxSliderPosition = state.track.size - state.slider.size;
      const currentSliderPosition = state.slider.position;
      const newSliderPosition = currentSliderPosition + delta;

      if (newSliderPosition > 0 && newSliderPosition <= maxSliderPosition) {
        const sliderRatio = newSliderPosition / maxSliderPosition;
        const scrollLeft = sliderRatio * maxScroll;
        onDrag(scrollLeft);
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
      dragRef.current = event.screenX;
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', dragEnd);
    },
    [handleDrag, dragEnd, dragRef]
  );

  return (
    state.enabled && (
      <Styled.HorizontalTrack
        data-sb-scrollarea-track=""
        data-sb-scrollarea-track-horizontal=""
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
          width: state.track.size,
        }}
      >
        <Styled.HorizontalSlider
          data-sb-scrollarea-slider=""
          data-sb-scrollarea-slider-horizontal=""
          sliderColor={sliderColor}
          sliderSize={sliderSize}
          sliderType={sliderType}
          onMouseDown={dragStart}
          style={{
            transform: `translateX(${state.slider.position}px)`,
            width: state.slider.size,
          }}
        />
      </Styled.HorizontalTrack>
    )
  );
};
