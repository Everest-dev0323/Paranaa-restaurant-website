import {
  Item,
  UpdateItemInput,
  addItemWithQuantity,
  removeItemOrQuantity,
  addItem,
  updateItem,
  removeItem,
  calculateUniqueItems,
  calculateItemTotals,
  calculateTotalItems,
  calculateTotal,
} from './cart.utils';

interface Metadata {
  [key: string]: any;
}

type Action =
  | { type: 'ADD_ITEM_WITH_QUANTITY'; item: Item; quantity: number }
  | { type: 'REMOVE_ITEM_OR_QUANTITY'; _id: Item['_id']; quantity?: number }
  | { type: 'ADD_ITEM'; _id: Item['_id']; item: Item }
  | { type: 'UPDATE_ITEM'; _id: Item['_id']; item: UpdateItemInput }
  | { type: 'REMOVE_ITEM'; _id: Item['_id'] }
  | { type: 'RESET_CART' };

export interface State {
  items: Item[];
  isEmpty: boolean;
  totalItems: number;
  totalUniqueItems: number;
  total: number;
  meta?: Metadata | null;
}
export const initialState: State = {
  items: [],
  isEmpty: true,
  totalItems: 0,
  totalUniqueItems: 0,
  total: 0,
  meta: null,
};
export function cartReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_ITEM_WITH_QUANTITY': {
      const items = addItemWithQuantity(
        state.items,
        action.item,
        action.quantity
      );
      return generateFinalState(state, items);
    }
    case 'REMOVE_ITEM_OR_QUANTITY': {
      const items = removeItemOrQuantity(
        state.items,
        action._id,
        (action.quantity = 1)
      );
      return generateFinalState(state, items);
    }
    case 'ADD_ITEM': {
      const items = addItem(state.items, action.item);
      return generateFinalState(state, items);
    }
    case 'REMOVE_ITEM': {
      const items = removeItem(state.items, action._id);
      return generateFinalState(state, items);
    }
    case 'UPDATE_ITEM': {
      const items = updateItem(state.items, action._id, action.item);
      return generateFinalState(state, items);
    }
    case 'RESET_CART':
      return initialState;
    default:
      return state;
  }
}

const generateFinalState = (state: State, items: Item[]) => {
  const totalUniqueItems = calculateUniqueItems(items);
  return {
    ...state,
    items: calculateItemTotals(items),
    totalItems: calculateTotalItems(items),
    totalUniqueItems,
    total: calculateTotal(items),
    isEmpty: totalUniqueItems === 0,
  };
};
