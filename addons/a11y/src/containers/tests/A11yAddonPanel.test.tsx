import React from 'react';
import { render, waitFor, fireEvent, act } from '@testing-library/react';

import { ThemeProvider, themes, convert } from '@storybook/theming';
import * as api from '@storybook/api';

import { A11yAddonPanel } from '../A11yAddonPanel';
import { EVENTS } from '../../constants';

jest.mock('@storybook/api');
const mockedApi = api as jest.Mocked<typeof api>;

const axeResult = {
  incomplete: [
    {
      id: 'color-contrast',
      impact: 'serious',
      tags: ['cat.color', 'wcag2aa', 'wcag143'],
      description:
        'Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
      help: 'Elements must have sufficient color contrast',
      helpUrl: 'https://dequeuniversity.com/rules/axe/3.2/color-contrast?application=axeAPI',
      nodes: [],
    },
  ],
  passes: [
    {
      id: 'aria-allowed-attr',
      impact: null,
      tags: ['cat.aria', 'wcag2a', 'wcag412'],
      description: "Ensures ARIA attributes are allowed for an element's role",
      help: 'Elements must only use allowed ARIA attributes',
      helpUrl: 'https://dequeuniversity.com/rules/axe/3.2/aria-allowed-attr?application=axeAPI',
      nodes: [],
    },
  ],
  violations: [
    {
      id: 'color-contrast',
      impact: 'serious',
      tags: ['cat.color', 'wcag2aa', 'wcag143'],
      description:
        'Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
      help: 'Elements must have sufficient color contrast',
      helpUrl: 'https://dequeuniversity.com/rules/axe/3.2/color-contrast?application=axeAPI',
      nodes: [],
    },
  ],
};

function ThemedA11YPanel() {
  return (
    <ThemeProvider theme={convert(themes.light)}>
      <A11yAddonPanel />
    </ThemeProvider>
  );
}

describe('A11YPanel', () => {
  beforeEach(() => {
    mockedApi.useChannel.mockReset();
    mockedApi.useParameter.mockReset();
    mockedApi.useStorybookState.mockReset();
    mockedApi.useAddonState.mockReset();

    mockedApi.useChannel.mockReturnValue(jest.fn());
    mockedApi.useParameter.mockReturnValue({ manual: false });
    const state: Partial<api.State> = { storyId: 'jest' };
    // Lazy to mock entire state
    mockedApi.useStorybookState.mockReturnValue(state as any);
    mockedApi.useAddonState.mockImplementation(React.useState);
  });

  it('should render', () => {
    const { container } = render(<A11yAddonPanel />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should register event listener on mount', () => {
    render(<A11yAddonPanel />);
    expect(mockedApi.useChannel).toHaveBeenCalledWith(
      expect.objectContaining({
        [EVENTS.RESULT]: expect.any(Function),
        [EVENTS.ERROR]: expect.any(Function),
      })
    );
  });

  it('should handle "initial" status', () => {
    const { getByText } = render(<A11yAddonPanel />);
    expect(getByText(/Initializing/)).toBeTruthy();
  });

  it('should handle "manual" status', async () => {
    mockedApi.useParameter.mockReturnValue({ manual: true });
    const { getByText } = render(<ThemedA11YPanel />);
    await waitFor(() => {
      expect(getByText(/Manually run the accessibility scan/)).toBeTruthy();
    });
  });

  describe('running', () => {
    it('should handle "running" status', async () => {
      const emit = jest.fn();
      mockedApi.useChannel.mockReturnValue(emit);
      mockedApi.useParameter.mockReturnValue({ manual: true });
      const { getByRole, getByText } = render(<ThemedA11YPanel />);
      await waitFor(() => {
        const button = getByRole('button', { name: 'Run test' });
        fireEvent.click(button);
      });
      await waitFor(() => {
        expect(getByText(/Please wait while the accessibility scan is running/)).toBeTruthy();
        expect(emit).toHaveBeenCalledWith(EVENTS.MANUAL, 'jest');
      });
    });

    it('should set running status on event', async () => {
      const { getByText } = render(<ThemedA11YPanel />);
      const useChannelArgs = mockedApi.useChannel.mock.calls[0][0];
      act(() => useChannelArgs[EVENTS.RUNNING]());
      await waitFor(() => {
        expect(getByText(/Please wait while the accessibility scan is running/)).toBeTruthy();
      });
    });
  });

  it('should handle "ran" status', async () => {
    const { getByText } = render(<ThemedA11YPanel />);
    const useChannelArgs = mockedApi.useChannel.mock.calls[0][0];
    act(() => useChannelArgs[EVENTS.RESULT](axeResult));
    await waitFor(() => {
      expect(getByText(/Tests completed/)).toBeTruthy();
      expect(getByText(/Violations/)).toBeTruthy();
      expect(getByText(/Passes/)).toBeTruthy();
      expect(getByText(/Incomplete/)).toBeTruthy();
    });
  });
});
