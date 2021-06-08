import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { NodeResult } from 'axe-core';
import { HighlightToggle } from '../GlobalHighlight';
import { A11yContext } from '../../A11yContext';

const nodeResult = (target: string): NodeResult => ({
  html: '',
  target: [target],
  any: [],
  all: [],
  none: [],
});

const defaultProviderValue = {
  results: {
    passes: [],
    incomplete: [],
    violations: [],
  },
  setResults: jest.fn(),
  highlighted: [],
  toggleHighlight: jest.fn(),
  clearHighlights: jest.fn(),
  tab: 0,
  setTab: jest.fn(),
};

describe('<HighlightToggle />', () => {
  it('should render', () => {
    const { container } = render(<HighlightToggle elementsToHighlight={[nodeResult('#root')]} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should be checked when all targets are highlighted', () => {
    const { getByRole } = render(
      <A11yContext.Provider
        value={{
          ...defaultProviderValue,
          highlighted: ['#root'],
        }}
      >
        <HighlightToggle elementsToHighlight={[nodeResult('#root')]} />
      </A11yContext.Provider>
    );
    const checkbox = getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBeTruthy();
  });

  it('should be mixed when some targets are highlighted', () => {
    const { getByRole } = render(
      <A11yContext.Provider
        value={{
          ...defaultProviderValue,
          highlighted: ['#root'],
        }}
      >
        <HighlightToggle elementsToHighlight={[nodeResult('#root'), nodeResult('#root1')]} />
      </A11yContext.Provider>
    );
    const checkbox = getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.indeterminate).toBeTruthy();
  });

  describe('toggleHighlight', () => {
    it.each`
      highlighted  | elementsToHighlight    | expected
      ${[]}        | ${['#root']}           | ${true}
      ${['#root']} | ${['#root']}           | ${false}
      ${['#root']} | ${['#root', '#root1']} | ${true}
    `(
      'should be triggered with $expected when highlighted is $highlighted and elementsToHighlight is $elementsToHighlight',
      ({ highlighted, elementsToHighlight, expected }) => {
        const { getByRole } = render(
          <A11yContext.Provider
            value={{
              ...defaultProviderValue,
              highlighted,
            }}
          >
            <HighlightToggle elementsToHighlight={elementsToHighlight.map(nodeResult)} />
          </A11yContext.Provider>
        );
        const checkbox = getByRole('checkbox') as HTMLInputElement;
        fireEvent.click(checkbox);
        expect(defaultProviderValue.toggleHighlight).toHaveBeenCalledWith(
          elementsToHighlight,
          expected
        );
      }
    );
  });
});
