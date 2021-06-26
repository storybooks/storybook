import { ScrollAreaStateItemSlider } from '../types';

const getRatio = (inner: number, outer: number) => {
  let ratio = 0;

  if (outer === 0) {
    return ratio;
  }

  ratio = outer / inner;

  return ratio;
};

type GetStateValuesProps = {
  innerSize: number;
  outerSize: number;
  scroll: number;
  enabled: boolean;
  sliderSafeSpacing: number;
};

type GetStateValuesResult = {
  slider: ScrollAreaStateItemSlider;
  enabled: boolean;
};

export const getStateValues = ({
  innerSize,
  outerSize,
  scroll,
  enabled,
  sliderSafeSpacing,
}: GetStateValuesProps) => {
  let stateValues: GetStateValuesResult = {
    enabled: false,
    slider: { size: 0, position: 0 },
  };

  if (innerSize <= outerSize || !enabled) {
    return stateValues;
  }

  const containerRatio = getRatio(innerSize, outerSize);
  const trackSize = outerSize - sliderSafeSpacing;
  const sliderSize = containerRatio * trackSize;
  const scrollRatio = getRatio(innerSize - outerSize, scroll);
  const availableSlideSpace = trackSize - sliderSize;
  const sliderPosition = scrollRatio * availableSlideSpace;

  stateValues = {
    enabled,
    slider: { size: sliderSize, position: sliderPosition },
  };

  return stateValues;
};
