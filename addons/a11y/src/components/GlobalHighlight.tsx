import React from 'react';
import { styled } from '@storybook/theming';
import { useA11yContext } from '../A11yContext';

/* eslint-disable import/order */
import type { NodeResult, Result } from 'axe-core';

enum CheckBoxStates {
  CHECKED,
  UNCHECKED,
  INDETERMINATE,
}

type ToggleProps = {
  elementsToHighlight: NodeResult[];
  toggleId?: string;
} & React.HTMLAttributes<HTMLInputElement>;

const Checkbox = styled.input<{ disabled: boolean }>(({ disabled }) => ({
  cursor: disabled ? 'not-allowed' : 'pointer',
}));

function areAllRequiredElementsHighlighted(
  elementsToHighlight: NodeResult[],
  highlighted: string[]
): CheckBoxStates {
  const highlightedCount = elementsToHighlight.filter((item) =>
    highlighted.includes(item.target[0])
  ).length;

  // eslint-disable-next-line no-nested-ternary
  return highlightedCount === 0
    ? CheckBoxStates.UNCHECKED
    : highlightedCount === elementsToHighlight.length
    ? CheckBoxStates.CHECKED
    : CheckBoxStates.INDETERMINATE;
}

export const HighlightToggle: React.FC<ToggleProps> = ({
  toggleId,
  elementsToHighlight = [],
  ...rest
}) => {
  const { toggleHighlight, highlighted } = useA11yContext();
  const checkBoxRef = React.useRef<HTMLInputElement>(null);
  const [checkBoxState, setChecked] = React.useState(
    areAllRequiredElementsHighlighted(elementsToHighlight, highlighted)
  );

  React.useEffect(() => {
    const newState = areAllRequiredElementsHighlighted(elementsToHighlight, highlighted);
    if (checkBoxRef.current) {
      checkBoxRef.current.indeterminate = newState === CheckBoxStates.INDETERMINATE;
    }
    setChecked(newState);
  }, [elementsToHighlight, highlighted]);

  const handleToggle = React.useCallback((): void => {
    toggleHighlight(
      elementsToHighlight.map((elem) => elem.target[0]),
      checkBoxState !== CheckBoxStates.CHECKED
    );
  }, [elementsToHighlight, checkBoxState, toggleHighlight]);

  return (
    <Checkbox
      ref={checkBoxRef}
      id={toggleId}
      type="checkbox"
      aria-label="Highlight result"
      disabled={!elementsToHighlight.length}
      onChange={handleToggle}
      onClick={(e) => {
        e.stopPropagation();
      }}
      checked={checkBoxState === CheckBoxStates.CHECKED}
      {...rest}
    />
  );
};

function retrieveAllNodesFromResults(items: Result[]): NodeResult[] {
  return items.reduce((acc, item) => acc.concat(item.nodes), [] as NodeResult[]);
}

export type GlobalHighlightProps = {
  elements?: Result[];
  results?: NodeResult[];
  id: string;
  label?: string;
};

export const GlobalHighlight = ({ elements, id, label, results }: GlobalHighlightProps) => {
  const items =
    // eslint-disable-next-line no-nested-ternary
    results !== undefined ? results : elements ? retrieveAllNodesFromResults(elements) : [];
  return items.length > 0 ? (
    <HighlightWrapper>
      {label && <HighlightLabel htmlFor={id}>{label}</HighlightLabel>}
      <HighlightToggle toggleId={id} elementsToHighlight={items} />
    </HighlightWrapper>
  ) : null;
};

export const HighlightWrapper = styled.div`
  cursor: pointer;
  font-size: 13px;
  line-height: 20px;
  display: flex;
  align-items: center;

  input {
    margin: 0 0 0 10px;
  }
`;

const HighlightLabel = styled.label<{}>(({ theme }) => ({
  cursor: 'pointer',
  userSelect: 'none',
  color: theme.color.dark,
}));
