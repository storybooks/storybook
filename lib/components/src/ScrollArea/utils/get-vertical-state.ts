import { SLIDER_SAFE_PADDING } from '../const';
import { HorizontalPositionType, VerticalPositionType } from '../types';
import { getStateValues } from './get-state-values';

interface GetVerticalStateProps {
  enableHorizontal: boolean;
  enableVertical: boolean;
  horizontalPosition: HorizontalPositionType;
  innerRect: DOMRect;
  outerRect: DOMRect;
  scrollTop: number;
  sliderPadding: number;
  sliderSize: number;
  verticalPosition: VerticalPositionType;
}

export const getVerticalState = ({
  enableHorizontal,
  enableVertical,
  horizontalPosition,
  innerRect,
  outerRect,
  scrollTop,
  sliderPadding,
  sliderSize,
  verticalPosition,
}: GetVerticalStateProps) => {
  const sliderSafeSpacing = enableHorizontal
    ? SLIDER_SAFE_PADDING * 2 + sliderSize + sliderPadding
    : SLIDER_SAFE_PADDING * 2;

  // Calculate the values to get the tracks into the right position for the scroll container
  const trackDelta = sliderPadding * 2 + sliderSize;

  const trackLeft = verticalPosition === 'left' ? 0 : outerRect.width - trackDelta;
  let trackTop = SLIDER_SAFE_PADDING;

  if (enableHorizontal && horizontalPosition === 'top') {
    trackTop = sliderSafeSpacing - SLIDER_SAFE_PADDING;
  }

  const trackSize = outerRect.height - sliderSafeSpacing;

  return {
    ...getStateValues({
      enabled: enableVertical,
      innerSize: innerRect.height,
      outerSize: outerRect.height,
      scroll: scrollTop,
      sliderSafeSpacing: enableHorizontal ? sliderSafeSpacing : SLIDER_SAFE_PADDING * 2,
    }),
    track: { top: trackTop, left: trackLeft, size: trackSize },
  };
};
