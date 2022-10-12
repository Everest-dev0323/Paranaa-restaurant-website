import React, { useCallback } from 'react';
import { cartReducer, State, initialState } from './cart.reducer';
import { Item, getItem, inStock } from './cart.utils';
import { useLocalStorage } from '@utils/use-local-storage';
interface CartProviderState extends State {
  addItemToCart: (item: Item, quantity: number) => void;
  removeItemFromCart: (_id: Item['_id']) => void;
  clearItemFromCart: (_id: Item['_id']) => void;
  getItemFromCart: (item: Item) => any | undefined;
  isInCart: (item: Item) => boolean;
  isInStock: (item: Item) => boolean;
  resetCart: () => void;
}
export const cartContext = React.createContext<CartProviderState | undefined>(
  undefined
);

cartContext.displayName = 'CartContext';

export const useCart = () => {
  const context = React.useContext(cartContext);
  if (context === undefined) {
    throw new Error(`useCart must be used within a CartProvider`);
  }
  return context;
};

export const CartProvider: React.FC = (props) => {
  const [savedCart, saveCart] = useLocalStorage(
    `pranaa-cart`,
    JSON.stringify(initialState)
  );
  const [state, dispatch] = React.useReducer(
    cartReducer,
    JSON.parse(savedCart!)
  );

  React.useEffect(() => {
    saveCart(JSON.stringify(state));
  }, [state, saveCart]);

  const addItemToCart = (item: Item, quantity: number) =>
    dispatch({ type: 'ADD_ITEM_WITH_QUANTITY', item, quantity });
  const removeItemFromCart = (_id: Item['_id']) =>
    dispatch({ type: 'REMOVE_ITEM_OR_QUANTITY', _id });
  const clearItemFromCart = (_id: Item['_id']) =>
    dispatch({ type: 'REMOVE_ITEM', _id });
  const isInCart = useCallback(
    (item: Item) => !!getItem(state.items, item),
    [state.items]
  );
  const getItemFromCart = useCallback(
    (item: Item) => getItem(state.items, item),
    [state.items]
  );
  const isInStock = useCallback(
    (item: Item) => inStock(state.items, item),
    [state.items]
  );
  const resetCart = () => dispatch({ type: 'RESET_CART' });
  const value = React.useMemo(
    () => ({
      ...state,
      addItemToCart,
      removeItemFromCart,
      clearItemFromCart,
      getItemFromCart,
      isInCart,
      isInStock,
      resetCart,
    }),
    [getItemFromCart, isInCart, isInStock, state]
  );
  return <cartContext.Provider value={value} {...props} />;
};
