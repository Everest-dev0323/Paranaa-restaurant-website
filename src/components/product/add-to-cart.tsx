import { useState, useEffect, useMemo } from 'react';
import Counter from '@components/ui/counter';
import { useCart } from '@contexts/cart/cart.context';
import { generateCartItem } from '@utils/generate-cart-item';
import PlusIcon from '@components/icons/plus-icon';
import useWindowSize from '@utils/use-window-size';
import { useUI } from '@contexts/ui.context';
import { getUser } from '@framework/customer/use-update-customer';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

interface Props {
  data: any;
  variation?: any;
  disabled?: boolean;
}

const AddToCart = ({ data, variation, disabled }: Props) => {
  const { width } = useWindowSize();
  const { mealType, filterDate } = useUI();
  const [user, setUser] = useState<any>();
  useEffect(() => {
    // Perform localStorage action
    const userid = localStorage.getItem('user')
    const getUserData = async() => {
      if (userid) {
        const userData = await getUser(JSON.parse(userid)._id)
        setUser(userData);
      }
    }
    getUserData()
  }, [])
  const {
    addItemToCart,
    removeItemFromCart,
    isInStock,
    getItemFromCart,
    isInCart,
  } = useCart();
  const filterData = {
    filterDate: filterDate,
    mealType: mealType
  }
  const item = generateCartItem(data!, variation, filterData);
  const handleAddClick = (
    e: React.MouseEvent<HTMLButtonElement | MouseEvent>
  ) => {
    e.stopPropagation();
    let materials = item?.main_ingredients.split(", ");
    var alles: any[] = [];
    user?.allergens.filter((a: any) => materials.includes(a.name)).map((a: any) => alles.push(a.name))
    console.log('ALert:', alles.toString())
    if(alles.toString()) {
      confirmAlert({
        title: 'Confirm to Order',
        message: `This product matchs with your saved allergens( ${alles.toString()} ).`,
        buttons: [
          {
            label: 'Yes',
            onClick: () =>{
              addItemToCart(item, 1);
            }
          },
          {
            label: 'No',
            onClick: () => {
              return
            }
          }
        ]
      });
    } else {
      addItemToCart(item, 1);
    }
  };
  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeItemFromCart(item._id);
  };
  const outOfStock = isInCart(item) && !isInStock(item);
  const iconSize = width! > 480 ? '19' : '17';
  return !isInCart(item) ? (
    <button
      className="flex items-center justify-center w-8 h-8 text-4xl rounded-full bg-brand lg:w-10 lg:h-10 text-brand-light focus:outline-none"
      aria-label="Count Button"
      onClick={handleAddClick}
      disabled={disabled || outOfStock}
    >
      <PlusIcon width={iconSize} height={iconSize} opacity="1" />
    </button>
  ) : (
    <Counter
      value={getItemFromCart(item).quantity}
      onDecrement={handleRemoveClick}
      onIncrement={handleAddClick}
      disabled={outOfStock}
      className="w-full"
    />
  );
};

export default AddToCart;
