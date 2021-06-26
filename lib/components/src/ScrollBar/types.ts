import type { ReactNode, HTMLAttributes } from 'react';
import type { Theme } from '@storybook/theming';

export interface ScrollAreaRenderProps {
  inner: DOMRect;
  outer: DOMRect;
  scroll: { left: number; top: number };
}

export type ChildRenderFunction = (renderProps: ScrollAreaRenderProps) => ReactNode;

export interface ScrollAreaStateItemSlider {
  size: number;
  position: number;
}

export interface ScrollAreaStateItemTrack {
  size: number;
  left: number;
  top: number;
}

export interface ScrollAreaStateItem {
  slider: ScrollAreaStateItemSlider;
  track: ScrollAreaStateItemTrack;
  enabled: boolean;
  show: boolean;
}

export interface ScrollAreaState {
  horizontal: ScrollAreaStateItem;
  vertical: ScrollAreaStateItem;
}

export type ShowOnType = 'always' | 'hover' | 'never' | 'scroll';

export type SliderType = keyof Theme['color'];

export type HorizontalPositionType = 'top' | 'bottom';

export type VerticalPositionType = 'left' | 'right';

export type ScrollAreaTrackProps = {
  showOn: ShowOnType;
  sliderOpacity: number;
  sliderPadding: number;
  sliderColor: string;
  sliderSize: number;
  sliderType: SliderType;
  maxScroll: number;
  state: ScrollAreaStateItem;
  onDrag: (scrollValue: number) => void;
  onMouseOver: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseOut: (event: React.MouseEvent<HTMLDivElement>) => void;
};

export type ScrollAreaProps = {
  absolute?: boolean;
  children?: ChildRenderFunction | ReactNode;
  horizontal?: boolean;
  horizontalPosition?: HorizontalPositionType;
  showOn?: ShowOnType;
  sliderColor?: string;
  sliderFadeout?: number;
  sliderOpacity?: number;
  sliderPadding?: number;
  sliderSize?: number;
  sliderType?: SliderType;
  vertical?: boolean;
  verticalPosition?: VerticalPositionType;
  contentProps?: HTMLAttributes<HTMLDivElement>;
  containerProps?: HTMLAttributes<HTMLDivElement>;
} & HTMLAttributes<HTMLDivElement>;
