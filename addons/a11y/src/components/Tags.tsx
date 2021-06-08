import React, { useRef } from 'react';
import { styled } from '@storybook/theming';
import { uniqueId } from 'lodash';
import { ADDON_ID } from '../constants';

/* eslint-disable import/order */
import type { TagValue } from 'axe-core';

type TagsProps = {
  tags: TagValue[];
} & React.HTMLAttributes<HTMLDivElement>;

export const Tags = ({ tags, ...rest }: TagsProps) => {
  const idRef = useRef(uniqueId(`${ADDON_ID}-tags`));

  return (
    <Wrapper {...rest}>
      {tags.map((tag) => {
        const key = `${idRef.current}-${tag}`;
        return <Item key={key}>{tag}</Item>;
      })}
    </Wrapper>
  );
};

const Wrapper = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
});

const Item = styled.div(({ theme }) => ({
  padding: '8px 12px',
  margin: '0 6px 6px 0',
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: `${theme.appBorderRadius}px`,
  backgroundColor: `${theme.background.content}`,
}));
