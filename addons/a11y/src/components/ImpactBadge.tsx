import React from 'react';
import { styled } from '@storybook/theming';
import { Badge } from '@storybook/components';

const formatSeverityText = (severity: string) => {
  return severity.charAt(0).toUpperCase().concat(severity.slice(1));
};

export enum ImpactValue {
  MINOR = 'minor',
  MODERATE = 'moderate',
  SERIOUS = 'serious',
  CRITICAL = 'critical',
}

type ImpactBadgeProps = {
  text?: string;
  impact: string;
};

export const ImpactBadge = ({ text, impact }: ImpactBadgeProps) => {
  let badgeType: any = null;
  switch (impact) {
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
    <Wrapper status={badgeType}>
      {text && `${text} `}
      {formatSeverityText(impact)}
    </Wrapper>
  );
};

const Wrapper = styled(Badge)({
  minWidth: 65,
  maxWidth: 'fit-content',
  width: '100%',
  textAlign: 'center',
  alignSelf: 'flex-start',
});
