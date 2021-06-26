import { useDOMRect } from '@storybook/addons';
import { Badge } from '@storybook/components';
import { styled } from '@storybook/theming';
import { CheckResult } from 'axe-core';
import React, { FC } from 'react';

const List = styled.div({
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: 4,
  paddingRight: 4,
  paddingTop: 4,
  fontWeight: '400',
} as any);

const Item = styled.div<{ elementWidth: number }>(({ elementWidth }) => {
  const maxWidthBeforeBreak = 407;
  return {
    flexDirection: elementWidth > maxWidthBeforeBreak ? 'row' : 'inherit',
    marginBottom: elementWidth > maxWidthBeforeBreak ? 6 : 12,
    display: elementWidth > maxWidthBeforeBreak ? 'flex' : 'block',
  };
});

const StyledBadge = styled(Badge)({
  padding: '2px 8px',
  marginBottom: 3,
  minWidth: 65,
  maxWidth: 'fit-content',
  width: '100%',
  textAlign: 'center',
});

const Message = styled.div({
  paddingLeft: 6,
  paddingRight: 23,
});

export enum ImpactValue {
  MINOR = 'minor',
  MODERATE = 'moderate',
  SERIOUS = 'serious',
  CRITICAL = 'critical',
}

interface RuleProps {
  rule: CheckResult;
}

const formatSeverityText = (severity: string) => {
  return severity.charAt(0).toUpperCase().concat(severity.slice(1));
};

const Rule: FC<RuleProps> = ({ rule }) => {
  const {
    ref: rectRef,
    rect: { width },
  } = useDOMRect({ live: true });

  let badgeType: any = null;
  switch (rule.impact) {
    case ImpactValue.CRITICAL:
      badgeType = 'critical';
      break;
    case ImpactValue.SERIOUS:
      badgeType = 'negative';
      break;
    case ImpactValue.MODERATE:
      badgeType = 'warning';
      break;
    case ImpactValue.MINOR:
      badgeType = 'neutral';
      break;
    default:
      break;
  }
  return (
    <Item ref={rectRef} elementWidth={width}>
      <StyledBadge status={badgeType}>{formatSeverityText(rule.impact)}</StyledBadge>
      <Message>{rule.message}</Message>
    </Item>
  );
};

interface RulesProps {
  rules: CheckResult[];
}

export const Rules: FC<RulesProps> = ({ rules }) => {
  return (
    <List>
      {rules.map((rule, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Rule rule={rule} key={index} />
      ))}
    </List>
  );
};
