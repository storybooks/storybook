import React from 'react';
import { styled } from '@storybook/theming';
import {
  Placeholder,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody as _AccordionBody,
} from '@storybook/components';
import { ReportDetails } from './ReportDetails';
import { GlobalHighlight } from './GlobalHighlight';
import { Tags } from './Tags';

/* eslint-disable import/order */
import type { Result } from 'axe-core';
import type { RuleType } from '../A11yContext';

export type ReportListProps = {
  items: Result[];
  empty: string;
  type: RuleType;
};

export const Report = ({ items, empty, type }: ReportListProps) => (
  <Accordion narrow allowMultipleOpen lined indentBody>
    {items && items.length > 0 ? (
      items.map((item, index) => {
        const highlightToggleId = `${type}-${item.id}`;

        return (
          <AccordionItem key={`${type}:${item.id}:${index + 1}`}>
            <AccordionHeader>
              <Label>
                <div>{item.description}</div>
                <GlobalHighlight id={highlightToggleId} results={item.nodes} />
              </Label>
            </AccordionHeader>
            <AccordionBody>
              <ReportHeader>
                <Help>{item.help}</Help>
                <Link href={item.helpUrl} target="_blank">
                  Learn more...
                </Link>
                <Tags tags={item.tags} key="tags" />
              </ReportHeader>
              <ReportDetails elements={item.nodes} type={type} />
            </AccordionBody>
          </AccordionItem>
        );
      })
    ) : (
      <Placeholder key="placeholder">{empty}</Placeholder>
    )}
  </Accordion>
);

const Label = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  marginRight: -2,
});

const AccordionBody = styled(_AccordionBody)({
  paddingRight: 24,
});

const ReportHeader = styled.div({
  marginBottom: 10,
});

const Help = styled.div({
  marginBottom: 4,
});

const Link = styled.a({
  marginBottom: 16,
  textDecoration: 'underline',
  display: 'inline-block',
});
