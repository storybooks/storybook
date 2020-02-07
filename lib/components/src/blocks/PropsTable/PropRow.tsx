import React, { FC } from 'react';
import Markdown from 'markdown-to-jsx';
import { isNil } from 'lodash';
import { transparentize } from 'polished';
import { styled } from '@storybook/theming';
import { PropDef } from './PropDef';
import { PropJsDoc } from './PropJsDoc';
import { PropValue } from './PropValue';
import { codeCommon } from '../../typography/shared';

export interface PropRowProps {
  row: PropDef;
}

const Name = styled.span({ fontWeight: 'bold' });

const Required = styled.span(({ theme }) => ({
  color: theme.color.negative,
  fontFamily: theme.typography.fonts.mono,
  cursor: 'help',
}));

const Description = styled.div(({ theme }) => ({
  '&&': {
    p: {
      margin: '0 0 10px 0',
    },
  },

  code: codeCommon({ theme }),

  '& code': {
    margin: 0,
    display: 'inline-block',
  },
}));

const Type = styled.div<{ hasDescription: boolean }>(({ theme, hasDescription }) => ({
  color:
    theme.base === 'light'
      ? transparentize(0.1, theme.color.defaultText)
      : transparentize(0.2, theme.color.defaultText),
  marginTop: hasDescription ? 4 : 0,
}));

const TypeWithJsDoc = styled.div<{ hasDescription: boolean }>(({ theme, hasDescription }) => ({
  color:
    theme.base === 'light'
      ? transparentize(0.1, theme.color.defaultText)
      : transparentize(0.2, theme.color.defaultText),
  marginTop: hasDescription ? 12 : 0,
  marginBottom: 12,
}));

export const PropRow: FC<PropRowProps> = ({
  row: { name, type, required, description, defaultValue, jsDocTags },
}) => {
  const hasDescription = !isNil(description) && description !== '';

  return (
    <tr>
      <td>
        <Name title={name}>{name}</Name>
        {required ? <Required title="Required">*</Required> : null}
      </td>
      <td>
        {hasDescription && (
          <Description>
            <Markdown>{description}</Markdown>
          </Description>
        )}
        {!isNil(jsDocTags) ? (
          <>
            <TypeWithJsDoc hasDescription={hasDescription}>
              <PropValue value={type} />
            </TypeWithJsDoc>
            <PropJsDoc tags={jsDocTags} />
          </>
        ) : (
          <Type hasDescription={hasDescription}>
            <PropValue value={type} />
          </Type>
        )}
      </td>
      <td>
        <PropValue value={defaultValue} />
      </td>
    </tr>
  );
};
