import { SLIDER_SAFE_PADDING } from '../const';
import { HorizontalPositionType, VerticalPositionType } from '../types';
import { getStateValues } from './get-state-values';

interface GetHorizontalStateProps {
  enableHorizontal: boolean;
  enableVertical: boolean;
  horizontalPosition: HorizontalPositionType;
  innerRect: DOMRect;
  outerRect: DOMRect;
  scrollLeft: number;
  sliderPadding: number;
  sliderSize: number;
  verticalPosition: VerticalPositionType;
}

export const getHorizontalState = ({
  enableHorizontal,
  enableVertical,
  horizontalPosition,
  innerRect,
  outerRect,
  scrollLeft,
  sliderPadding,
  sliderSize,
  verticalPosition,
}: GetHorizontalStateProps) => {
  const sliderSafeSpacing = enableVertical
    ? SLIDER_SAFE_PADDING * 2 + sliderSize + sliderPadding
    : SLIDER_SAFE_PADDING * 2;

  // Calculate the values to get the tracks into the right position for the scroll container
  const trackDelta = sliderPadding * 2 + sliderSize;

  const trackTop = horizontalPosition === 'top' ? 0 : outerRect.height - trackDelta;
  let trackLeft = SLIDER_SAFE_PADDING;

  if (enableVertical && verticalPosition === 'left') {
    trackLeft = sliderSafeSpacing - SLIDER_SAFE_PADDING;
  }

  const trackSize = outerRect.width - sliderSafeSpacing;

  return {
    ...getStateValues({
      enabled: enableHorizontal,
      innerSize: innerRect.width,
      outerSize: outerRect.width,
      scroll: scrollLeft,
      sliderSafeSpacing,
    }),
    track: { top: trackTop, left: trackLeft, size: trackSize },
  };
};
