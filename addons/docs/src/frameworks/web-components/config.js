/* global window */
import React from 'react';
import { render } from 'lit-html';
import { extractArgTypes, extractComponentDescription } from './custom-elements';

const prepareForInline = (storyFn) => {
  class Story extends React.Component {
    constructor(props) {
      super(props);
      this.wrapperRef = React.createRef();
    }

    componentDidMount() {
      render(storyFn(), this.wrapperRef.current);
    }

    render() {
      return React.createElement('div', { ref: this.wrapperRef });
    }
  }
  return React.createElement(Story);
};

export const parameters = {
  docs: {
    extractArgTypes,
    extractComponentDescription,
    inlineStories: true,
    prepareForInline,
  },
};
