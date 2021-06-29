import { TabMenu } from '../types';

export const GetMenuItemById = (id: string, items: TabMenu[]) => {
  let foundItem: TabMenu;

  items.some((item) => {
    const hit = item.id === id;
    foundItem = hit ? item : undefined;
    return hit;
  });

  return foundItem;
};
