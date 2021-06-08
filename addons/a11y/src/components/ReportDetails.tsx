import React, { useRef, useState } from 'react';
import { uniqueId } from 'lodash';
import { styled } from '@storybook/theming';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  Icons,
} from '@storybook/components';
import { ImpactBadge } from './ImpactBadge';
import { RuleType } from '../A11yContext';
import { GlobalHighlight } from './GlobalHighlight';
import { ADDON_ID } from '../constants';

/* eslint-disable import/order */
import type { NodeResult } from 'axe-core';

const createKeyArray = (length: number) => {
  const keyArray: number[] = [];
  let i = 0;

  // eslint-disable-next-line no-plusplus
  for (i; i < length; i++) {
    // Plus 2 because we have a header in the list that is not expandable
    keyArray.push(i + 2);
  }

  return keyArray;
};

const extractBadgesFromElements = (elements: NodeResult[], id: string) => {
  const occurenceMap: Record<string, number> = {};

  elements.forEach((element) => {
    const { any, all, none } = element;
    const rules = [...any, ...all, ...none];

    rules.forEach(({ impact }) => {
      if (impact) {
        if (!occurenceMap[impact]) {
          occurenceMap[impact] = 1;
        } else {
          occurenceMap[impact] += 1;
        }
      }
    });
  });

  const badges = Object.keys(occurenceMap).map((impact) => {
    const occurences = occurenceMap[impact];

    return (
      <ImpactBadge key={`${id}-rule-badge-${impact}`} impact={impact} text={`${occurences} x`} />
    );
  });

  return badges;
};

interface ReportDetailsProps {
  elements: NodeResult[];
  type: RuleType;
}

export const ReportDetails = ({ elements, type }: ReportDetailsProps) => {
  const allOpenIds = createKeyArray(elements.length || 0);

  const id = `${ADDON_ID}-report-details`;
  const keyRef = useRef(uniqueId(id));
  const [openIds, setOpenIds] = useState<number[]>([]);

  const ruleBadges = extractBadgesFromElements(elements, id);

  return (
    <Accordion narrow lined rounded bordered allowMultipleOpen indentBody open={openIds}>
      <AccordionItem preventToggle>
        <AccordionHeader>
          <ControlWrapper>
            <BadgeWrapper>{ruleBadges.map((r) => r)}</BadgeWrapper>
            <Controls>
              <Icons
                aria-label="Expand All"
                icon="expandalt"
                onClick={() => {
                  setOpenIds([...allOpenIds]);
                }}
              />
              <Icons
                aria-label="Collapse All"
                icon="collapse"
                onClick={() => {
                  setOpenIds([]);
                }}
              />
            </Controls>
          </ControlWrapper>
        </AccordionHeader>
      </AccordionItem>
      {elements.map((element, index) => {
        const key = `${keyRef.current}-${index}`;
        const { any, all, none } = element;
        const rules = [...any, ...all, ...none];
        const highlightToggleId = `${type}-${element.target[0]}`;

        return (
          <AccordionItem key={key}>
            <AccordionHeader>
              <Label>
                <div>
                  {index + 1}. {element.target[0]}
                </div>
                <GlobalHighlight id={highlightToggleId} results={[element]} />
              </Label>
            </AccordionHeader>
            <AccordionBody style={{ backgroundColor: 'transparent' }}>
              {rules.map((rule, ruleIndex) => {
                const ruleKey = `${key}-rule-${ruleIndex}`;
                return (
                  <Rule key={ruleKey}>
                    <ImpactBadge impact={rule.impact} />
                    <Message>{rule.message}</Message>
                  </Rule>
                );
              })}
            </AccordionBody>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

const Label = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  paddingRight: 5,
  fontSize: 13,
});

const ControlWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '6px 0',
});

const BadgeWrapper = styled.div({
  display: 'flex',
  flexGrow: 1,
  '& > div': {
    marginRight: 8,
  },
});

const Controls = styled.div({
  display: 'flex',
  alignItems: 'center',
  '& > svg': {
    marginRight: 6,
    marginLeft: 6,
    cursor: 'pointer',
    width: 12,
    height: 12,
  },
});

const Rule = styled.div({
  display: 'flex',
  marginBottom: 16,
  '&:last-of-type': {
    marginBottom: 0,
  },
});

const Message = styled.div({
  fontSize: 13,
  paddingTop: 1,
  marginLeft: 16,
});
