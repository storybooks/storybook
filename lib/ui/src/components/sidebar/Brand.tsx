import React from 'react';
import { styled, withTheme, Theme } from '@storybook/theming';

import { StorybookLogo } from '@storybook/components';

export const StorybookLogoStyled = styled(StorybookLogo)({
  width: 'auto',
  height: '22px !important',
  display: 'block',
});

export const Img = styled.img({
  width: 'auto',
  height: 'auto',
  display: 'block',
  maxWidth: '100%',
});

export const LogoLink = styled.a(({ theme }) => ({
  display: 'inline-block',
  height: '100%',
  margin: '-3px -4px',
  padding: '2px 3px',
  border: '1px solid transparent',
  borderRadius: 3,
  color: 'inherit',
  textDecoration: 'none',
  '&:focus': {
    outline: 0,
    borderColor: theme.color.secondary,
  },
}));

export const Brand = withTheme(({ theme }) => {
  const { title = 'Storybook', url = './', image } = theme.brand;
  const targetValue = url === './' ? '' : '_blank';

  // When image is explicitly set to null, enable custom HTML support
  if (image === null) {
    if (title === null) return null;
    // eslint-disable-next-line react/no-danger
    if (!url) return <div dangerouslySetInnerHTML={{ __html: title }} />;
    return <LogoLink href={url} target={targetValue} dangerouslySetInnerHTML={{ __html: title }} />;
  }

  const logo = image ? <Img src={image} alt={title} /> : <StorybookLogoStyled alt={title} />;

  if (url) {
    return (
      <LogoLink title={title} href={url} target={targetValue}>
        {logo}
      </LogoLink>
    );
  }

  // The wrapper div serves to prevent image misalignment
  return <div>{logo}</div>;
});
