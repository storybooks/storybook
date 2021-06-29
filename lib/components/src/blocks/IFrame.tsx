import React, { Component } from 'react';
import root from '@storybook/global-root';

interface IFrameProps {
  id: string;
  key?: string;
  title: string;
  src: string;
  allowFullScreen: boolean;
  scale: number;
  style?: any;
}

interface BodyStyle {
  width: string;
  height: string;
  transform: string;
  transformOrigin: string;
}

export class IFrame extends Component<IFrameProps> {
  iframe: HTMLIFrameElement | null = null;

  componentDidMount() {
    const { id } = this.props;
    this.iframe = root.document.getElementById(id) as HTMLIFrameElement;
  }

  shouldComponentUpdate(nextProps: IFrameProps) {
    const { scale } = nextProps;
    // eslint-disable-next-line react/destructuring-assignment
    if (scale !== this.props.scale) {
      this.setIframeBodyStyle({
        width: `${scale * 100}%`,
        height: `${scale * 100}%`,
        transform: `scale(${1 / scale})`,
        transformOrigin: 'top left',
      });
    }
    return false;
  }

  setIframeBodyStyle(style: BodyStyle) {
    return Object.assign(this.iframe.contentDocument.body.style, style);
  }

  render() {
    const { id, title, src, allowFullScreen, scale, ...rest } = this.props;
    return (
      <iframe
        id={id}
        title={title}
        src={src}
        allowFullScreen={allowFullScreen}
        // @ts-ignore
        loading="lazy"
        {...rest}
      />
    );
  }
}
