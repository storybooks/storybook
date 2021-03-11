import React, { FunctionComponent, SyntheticEvent } from 'react';
import { State } from '@storybook/api';
import { Link } from '@storybook/router';
import { styled } from '@storybook/theming';
import { Icons, IconButton, IconsProps } from '@storybook/components';
import { transparentize } from 'polished';

const DEFAULT_ICON_COLOUR = '#66BF3C' as const;

const Notification = styled.div(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  padding: 15,
  width: 280,
  borderRadius: 4,

  background:
    theme.base === 'light'
      ? 'rgba(50,53,71,0.97)'
      : 'linear-gradient(0deg, rgba(248,248,248,0.97) 0%, rgba(247,252,255,0.97) 100%)',
  boxShadow: `0 2px 5px 0 rgba(0,0,0,0.05), 0 5px 15px 0 rgba(0,0,0,0.1)`,
  color: theme.color.inverseText,
  textDecoration: 'none',
}));

const NotificationWithInteractiveStates = styled(Notification)(() => ({
  transition: 'all 150ms ease-out',
  transform: 'translate3d(0, 0, 0)',
  '&:hover': {
    transform: 'translate3d(0, -3px, 0)',
    boxShadow:
      '0 1px 3px 0 rgba(30,167,253,0.5), 0 2px 5px 0 rgba(0,0,0,0.05), 0 5px 15px 0 rgba(0,0,0,0.1)',
  },
  '&:active': {
    transform: 'translate3d(0, 0, 0)',
    boxShadow:
      '0 1px 3px 0 rgba(30,167,253,0.5), 0 2px 5px 0 rgba(0,0,0,0.05), 0 5px 15px 0 rgba(0,0,0,0.1)',
  },
  '&:focus': {
    boxShadow:
      '0 1px 3px 0 rgba(30,167,253,0.5), 0 2px 5px 0 rgba(0,0,0,0.05), 0 5px 15px 0 rgba(0,0,0,0.1)',
  },
}));
const NotificationLink = NotificationWithInteractiveStates.withComponent(Link);

const NotificationIconWrapper = styled.div(() => ({
  display: 'flex',
  marginRight: 10,
  alignItems: 'center',
}));

const NotificationTextWrapper = styled.div(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const Headline = styled.div<{ hasIcon: boolean }>(({ theme, hasIcon }) => ({
  height: '100%',
  width: hasIcon ? 205 : 230,
  alignItems: 'center',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: theme.typography.size.s1,
  lineHeight: '16px',
  fontWeight: theme.typography.weight.bold,
}));

const SubHeadline = styled.div(({ theme }) => ({
  color: transparentize(0.25, theme.color.inverseText),
  fontSize: theme.typography.size.s1 - 1,
  lineHeight: '14px',
  marginTop: 2,
}));

const ItemContent: FunctionComponent<Pick<State['notifications'][0], 'icon' | 'content'>> = ({
  icon,
  content: { headline, subHeadline },
}) => (
  <>
    {!icon || (
      <NotificationIconWrapper>
        <Icons
          icon={icon.name as IconsProps['icon']}
          width={16}
          color={icon.color || DEFAULT_ICON_COLOUR}
        />
      </NotificationIconWrapper>
    )}
    <NotificationTextWrapper>
      <Headline title={headline} hasIcon={!!icon}>
        {headline}
      </Headline>
      {subHeadline && <SubHeadline>{subHeadline}</SubHeadline>}
    </NotificationTextWrapper>
  </>
);

const DismissButtonWrapper = styled<any>(IconButton)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  color: theme.base === 'light' ? 'rgba(255,255,255,0.7)' : ' #999999',
}));

const DismissNotificationItem: FunctionComponent<{
  onDismiss: () => void;
}> = ({ onDismiss }) => (
  <div>
    <DismissButtonWrapper
      title="Dismiss notification"
      onClick={(e: SyntheticEvent) => {
        e.preventDefault();
        onDismiss();
      }}
    >
      <Icons icon="closeAlt" height={12} width={12} />
    </DismissButtonWrapper>
  </div>
);

export const NotificationItemSpacer = styled.div({
  height: 48,
});

const NotificationItem: FunctionComponent<{
  notification: State['notifications'][0];
  onDismissNotification: (id: string) => void;
}> = ({ notification: { content, link, onClear, id, icon }, onDismissNotification }) => {
  const dismissNotificationItem = () => {
    onDismissNotification(id);
    onClear();
  };
  return link ? (
    <NotificationLink to={link}>
      <ItemContent icon={icon} content={content} />
      <DismissNotificationItem onDismiss={dismissNotificationItem} />
    </NotificationLink>
  ) : (
    <Notification>
      <ItemContent icon={icon} content={content} />
      <DismissNotificationItem onDismiss={dismissNotificationItem} />
    </Notification>
  );
};

export default NotificationItem;
