import React from 'react';
import { Accordion } from '../Accordion';
import { AccordionItem } from '../AccordionItem';
import { AccordionHeader } from '../AccordionHeader';
import { AccordionBody } from '../AccordionBody';
import { Icons } from '../../icon/icon';

// eslint-disable-next-line import/order
import type { Story, Meta } from '@storybook/react';

export default {
  title: 'Basics/Accordion/Stories',
  component: Accordion,
  parameters: {
    actions: { disable: true },
    test: { disable: true },
    controls: { disable: true },
  },
} as Meta;

export const OneDefaultOpen: Story = () => (
  <Accordion open={1}>
    <AccordionItem>
      <AccordionHeader>Item 1 - Default open</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>Item 2</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>Item 3</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>Item 4</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
  </Accordion>
);

export const MultipleDefaultOpen: Story = () => (
  <Accordion open={[1, 2]} allowMultipleOpen>
    <AccordionItem>
      <AccordionHeader>Item 1 - Default open</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>Item 2 - Default open</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>Item 3</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>Item 4</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
  </Accordion>
);

export const BorderedAndLined: Story = () => (
  <Accordion bordered lined>
    <AccordionItem>
      <AccordionHeader>Item 1</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>Item 2</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>Item 3</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>Item 4</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
  </Accordion>
);

export const OneHeaderOnly: Story = () => (
  <Accordion bordered lined>
    <AccordionItem>
      <AccordionHeader>Item 1</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>Item 2 - Header only</AccordionHeader>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>Item 3</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>Item 4</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
  </Accordion>
);

export const CustomIcon: Story = () => (
  <Accordion open={1}>
    <AccordionItem>
      <AccordionHeader>Item 1 - Default open</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader Icon={<Icons icon="thumbsup" />}>Item 2 - Custom icon</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>Item 3</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>Item 4</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
  </Accordion>
);

export const NestedAndVarious: Story = () => (
  <Accordion bordered lined rounded allowMultipleOpen>
    <AccordionItem open>
      <AccordionHeader Icon={<Icons icon="document" />}>
        Forced open with custom icon
      </AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>Accessibility Report</AccordionHeader>
      <AccordionBody>
        <Accordion bordered lined allowMultipleOpen narrow>
          <AccordionItem>
            <AccordionHeader>
              Ensures ARIA attributes are allowed for an element's role
            </AccordionHeader>
            <AccordionBody>results here</AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader>
              Ensures role attribute has an appropriate value for the element
            </AccordionHeader>
            <AccordionBody>results here</AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader>
              Ensures elements with ARIA roles have all required ARIA attributes
            </AccordionHeader>
            <AccordionBody>results here</AccordionBody>
          </AccordionItem>
        </Accordion>
      </AccordionBody>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>Jest</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader>Item 4</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItem>
  </Accordion>
);
