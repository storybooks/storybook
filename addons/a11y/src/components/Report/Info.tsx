import React, { FunctionComponent } from 'react';

import { styled } from '@storybook/theming';
import { Result } from 'axe-core';

const Wrapper = styled.div({
  padding: 12,
  marginBottom: 10,
});
const Help = styled.p({
  margin: '0 0 12px',
});
const Link = styled.a({
  marginTop: 12,
  textDecoration: 'underline',
  color: 'inherit',
  display: 'block',
});

interface InfoProps {
  item: Result;
}

export const Info: FunctionComponent<InfoProps> = ({ item }) => (
  <Wrapper>
    <Help>{item.help}</Help>
    <Link href={item.helpUrl} target="_blank">
      More info...
    </Link>
  </Wrapper>
);
