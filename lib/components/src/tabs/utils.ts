import { Children } from 'react';

export type TabListChildProps = {
  id: string;
  color: string;
  title: string | (() => string);
} & React.HTMLAttributes<HTMLDivElement>;

export type TabChildRenderProps = {
  key: string;
  active: boolean;
  id: string;
  index: number;
};

export type ChildToListItem = {
  active: boolean;
  title: string;
  id: string;
  color: string;
  content: React.ReactNode;
};

export const getChildIndexById = (id: string, list: ChildToListItem[]) => {
  let index: number | undefined;

  list.some((item, _index) => {
    const found = id === item.id;
    if (found) {
      index = _index;
    }

    return found;
  });

  return index;
};

export const childrenToList = (children: React.ReactNode, selected: string): ChildToListItem[] => {
  return Children.toArray(children).map(
    (
      {
        props: { title: _title, id, color, children: childrenOfChild },
      }: React.ReactElement<TabListChildProps>,
      index
    ) => {
      const active = selected ? id === selected : index === 0;
      const child = Array.isArray(childrenOfChild) ? childrenOfChild[0] : childrenOfChild;
      const childProps: TabChildRenderProps = {
        id: `${id}-content`,
        key: `${id}-content`,
        active,
        index,
      };
      const title = typeof _title === 'function' ? _title() : _title;

      const content = typeof child === 'function' ? child(childProps) : child;

      return { active, title, id, color, content };
    }
  );
};
