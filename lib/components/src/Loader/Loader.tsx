import root from '@storybook/global-root';
import { transparentize } from 'polished';
import React, { ComponentProps, FunctionComponent, useEffect, useState } from 'react';
import { styled, keyframes } from '@storybook/theming';
import { Icons } from '../icon/icon';
import { rotate360 } from '../shared/animation';

const { EventSource, CONFIG_TYPE } = root;

const LoaderWrapper = styled.div<{ size?: number }>(({ size = 32 }) => ({
  borderRadius: '50%',
  cursor: 'progress',
  display: 'inline-block',
  overflow: 'hidden',
  position: 'absolute',
  transition: 'all 200ms ease-out',
  verticalAlign: 'top',
  top: '50%',
  left: '50%',
  marginTop: -(size / 2),
  marginLeft: -(size / 2),
  height: size,
  width: size,
  zIndex: 4,
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: 'rgba(97, 97, 97, 0.29)',
  borderTopColor: 'rgb(100,100,100)',
  animation: `${rotate360} 0.7s linear infinite`,
  mixBlendMode: 'difference',
}));

const ProgressWrapper = styled.div({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
});

const ProgressTrack = styled.div(({ theme }) => ({
  position: 'relative',
  width: '80%',
  marginBottom: '0.75rem',
  maxWidth: 300,
  height: 5,
  borderRadius: 5,
  background: transparentize(0.8, theme.color.secondary),
  overflow: 'hidden',
  cursor: 'progress',
}));

const ProgressBar = styled.div(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  background: theme.color.secondary,
}));

const ProgressMessage = styled.div(({ theme }) => ({
  minHeight: '2em',
  fontSize: `${theme.typography.size.s1}px`,
  color: theme.barTextColor,
}));

const ErrorIcon = styled(Icons)(({ theme }) => ({
  width: 20,
  height: 20,
  marginBottom: '0.5rem',
  color: theme.color.mediumdark,
}));

const ellipsis = keyframes`
  from { content: "..." }
  33% { content: "." }
  66% { content: ".." }
  to { content: "..." }
`;

const Ellipsis = styled.span({
  '&::after': {
    content: "'...'",
    animation: `${ellipsis} 1s linear infinite`,
    animationDelay: '1s',
    display: 'inline-block',
    width: '1em',
    height: 'auto',
  },
});

interface Progress {
  value: number;
  message: string;
  modules?: {
    complete: number;
    total: number;
  };
}

interface LoaderProps {
  progress?: Progress;
  error?: Error;
  size?: number;
}

export const PureLoader: FunctionComponent<
  LoaderProps & ComponentProps<typeof ProgressWrapper>
> = ({ progress, error, size, ...props }) => {
  if (error) {
    return (
      <ProgressWrapper aria-label={error.toString()} aria-live="polite" role="status" {...props}>
        <ErrorIcon icon="lightningoff" />
        <ProgressMessage>{error.message}</ProgressMessage>
      </ProgressWrapper>
    );
  }

  if (progress) {
    const { value, modules } = progress;
    let { message } = progress;
    if (modules) message += ` ${modules.complete} / ${modules.total} modules`;
    return (
      <ProgressWrapper
        aria-label="Content is loading..."
        aria-live="polite"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value * 100}
        aria-valuetext={message}
        role="progressbar"
        {...props}
      >
        <ProgressTrack>
          <ProgressBar style={{ width: `${value * 100}%` }} />
        </ProgressTrack>
        <ProgressMessage>
          {message}
          {value < 1 && <Ellipsis key={message} />}
        </ProgressMessage>
      </ProgressWrapper>
    );
  }

  return (
    <LoaderWrapper
      aria-label="Content is loading..."
      aria-live="polite"
      role="status"
      size={size}
      {...props}
    />
  );
};

export const Loader: FunctionComponent<ComponentProps<typeof PureLoader>> = (props) => {
  const [progress, setProgress] = useState(undefined);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    // Don't listen for progress updates in static builds
    // Event source is not defined in IE 11
    if (CONFIG_TYPE !== 'DEVELOPMENT' || !EventSource) return undefined;

    const eventSource = new EventSource('/progress');
    let lastProgress: Progress;

    eventSource.onmessage = (event: any) => {
      try {
        lastProgress = JSON.parse(event.data);
        setProgress(lastProgress);
      } catch (e) {
        setError(e);
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      if (lastProgress && lastProgress.value !== 1) setError(new Error('Connection closed'));
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  return <PureLoader progress={progress} error={error} {...props} />;
};
