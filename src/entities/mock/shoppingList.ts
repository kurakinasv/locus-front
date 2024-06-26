import { ShoppingList } from 'entities/shoppingList';

import { MOCK_PRODUCTS } from './products';

export const MOCK_SHOPPING_LISTS: ShoppingList[] = [
  {
    id: 1,
    name: 'Первый список покупок',
    products: MOCK_PRODUCTS,
    purchaseDate: new Date().toISOString(),
    description: 'Первый список покупок',
    groupId: '1',
  },
  {
    id: 2,
    name: 'Второй список покупок',
    products: MOCK_PRODUCTS,
    purchaseDate: '2021-08-02',
    description: 'Второй список покупок',
    groupId: '1',
  },
];
