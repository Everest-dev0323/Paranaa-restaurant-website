import Image from '@components/ui/image';
import Link from '@components/ui/link';
import { ROUTES } from '@utils/routes';
import { searchProductPlaceholder } from '@assets/placeholders';
import PlusIcon from '@components/icons/plus-icon';
import { useCart } from '@contexts/cart/cart.context';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import useWindowSize from '@utils/use-window-size';
import { Product } from '@framework/types';
import { useUI } from '@contexts/ui.context';

import { useModalAction } from '@components/common/modal/modal.context';


type SearchProductProps = {
  item: any;
};

const AddToCart = dynamic(() => import('@components/product/add-to-cart'), {
  ssr: false,
});

interface ProductProps {
  product: Product;
  className?: string;
}

function RenderPopupOrAddToCart({ data }: { data: Product }) {
  const { t } = useTranslation('common');
  const { _id, quantity, product_type } = data ?? {};
  const { width } = useWindowSize();
  const { openModal } = useModalAction();
  const { isInCart, isInStock } = useCart();
  const iconSize = width! > 1024 ? '19' : '17';
  const outOfStock = isInCart(data) && !isInStock(data);
  function handlePopupView() {
    openModal('PRODUCT_VIEW', data);
  }
  if (Number(quantity) < 1 || outOfStock) {
    return (
      <span className="text-[11px] md:text-xs font-bold text-brand-light uppercase inline-block bg-brand-danger rounded-full px-2.5 pt-1 pb-[3px] mx-0.5 sm:mx-1">
        {t('text-out-stock')}
      </span>
    );
  }
  if (product_type === 'variable') {
    return (
      <button
        className="inline-flex items-center justify-center w-8 h-8 text-4xl rounded-full bg-brand lg:w-10 lg:h-10 text-brand-light focus:outline-none focus-visible:outline-none"
        aria-label="Count Button"
        onClick={handlePopupView}
      >
        <PlusIcon width={iconSize} height={iconSize} opacity="1" />
      </button>
    );
  }
  return <AddToCart data={data} />;
}
const SearchProduct: React.FC<SearchProductProps> = ({ item }) => {
  const { openModal } = useModalAction();
  const { isAuthorized } = useUI()

  function handlePopupView() {
    if(isAuthorized && localStorage.getItem('user')) {
      openModal('PRODUCT_VIEW', item);
    } else {
      openModal('LOGIN_VIEW');
    }
  }
  return (
    <span
     // href={`${ROUTES.PRODUCT}/${item?.slug}`}
      onClick={handlePopupView}
      className="flex items-center justify-start w-full h-auto group hover:cursor-pointer"
    >
      <div className="relative flex w-12 h-12 overflow-hidden rounded-md cursor-pointer shrink-0 ltr:mr-4 rtl:ml-4">
        <Image
          src={item?.image[0]?.thumbnail ?? searchProductPlaceholder}
          width={48}
          height={48}
          loading="eager"
          alt={item.name || 'Product Image'}
          className="object-cover bg-fill-thumbnail"
        />
      </div>
      <div className="flex flex-col w-full overflow-hidden">
        <h3 className="truncate text-brand-dark text-15px">{item.name}</h3>
      {/* <span>{item.category_id}</span>*/}
      {item?.dates.map((item: any, index:number) => (
        <>
        <select value={item} className="bg-green-500 mr-4 mt-2 text-white hover:bg-white appearance-none py-1 font-bold bg-clip-padding bg-no-repeat border border-green-600 transition ease-in-out m-0  focus:bg-green focus:text-green hover:text-gray-600 form-select form-select-sm rounded-full shadow-md">
        <option key={index+item.date}>{item.date}</option>
        <option key={index+item.meal_type}>{item.meal_type}</option> 
        </select>

        {/*<div className="block product-count-button-position">
        <RenderPopupOrAddToCart data={product} />
      </div>*/}
        </>
      ))}
      </div>
      
    </span>
  );
};

export default SearchProduct;
