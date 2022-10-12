import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import isEmpty from 'lodash/isEmpty';
import { ROUTES } from '@utils/routes';
import { useUI } from '@contexts/ui.context';
import Button from '@components/ui/button';
import Counter from '@components/ui/counter';
import { useCart } from '@contexts/cart/cart.context';
import ProductAttributes from '@components/product/product-attributes';
import { generateCartItem } from '@utils/generate-cart-item';
import usePrice from '@framework/product/use-price';
import { getVariations } from '@framework/utils/get-variations';
import { useTranslation } from 'next-i18next';
import ThumbnailCarousel from '@components/ui/carousel/thumbnail-carousel';
import Image from '@components/ui/image';
import CartIcon from '@components/icons/cart-icon';
import Heading from '@components/ui/heading';
import Text from '@components/ui/text';
import TagLabel from '@components/ui/tag-label';
import LabelIcon from '@components/icons/label-icon';
import { IoArrowRedoOutline } from 'react-icons/io5';
import RelatedProductFeed from '@components/product/feeds/related-product-feed';
import SocialShareBox from '@components/ui/social-share-box';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
import {
  useModalAction,
  useModalState,
} from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import VariationPrice from './variation-price';
import isEqual from 'lodash/isEqual';
import { productGalleryPlaceholder, productPlaceholder } from '@assets/placeholders';
import { getUser } from '@framework/customer/use-update-customer';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import ShowMoreText from "react-show-more-text";


const breakpoints = {
  '1536': {
    slidesPerView: 6,
  },
  '1280': {
    slidesPerView: 5,
  },
  '1024': {
    slidesPerView: 4,
  },
  '640': {
    slidesPerView: 3,
  },
  '360': {
    slidesPerView: 2,
  },
  '0': {
    slidesPerView: 1,
  },
};

export default function ProductPopup() {
  const { mealType, filterDate } = useUI();
  const [user, setUser] = useState<any>();
  const { t } = useTranslation('common');
  const { data } = useModalState();
  const { width } = useWindowSize();
  const { closeModal } = useModalAction();
  const router = useRouter();
  const { addItemToCart, isInCart, getItemFromCart, isInStock } = useCart();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
  const [favorite, setFavorite] = useState<boolean>(false);
  const [addToWishlistLoader, setAddToWishlistLoader] =
    useState<boolean>(false);
  const [shareButtonStatus, setShareButtonStatus] = useState<boolean>(false);
  const { price, basePrice, discount } = usePrice({
    amount: data.sale_price ? data.sale_price : data.price,
    baseAmount: data.price,
    currencyCode: 'THB',
  });
  const variations = getVariations(data.variations);
  // console.log('variations', variations)
  const { slug, image, name, unit, description, gallery, tag, quantity, main_ingredients, nutritional_info } = data;
  const productUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}${ROUTES.PRODUCT}/${slug}`;
  // console.log(data);
  const handleChange = () => {
    setShareButtonStatus(!shareButtonStatus);
  };
  const isSelected = !isEmpty(variations)
    ? !isEmpty(attributes) &&
    Object.keys(variations).every((variation) =>
      attributes.hasOwnProperty(variation)
    )
    : true;
  let selectedVariation: any = {};
  if (isSelected) {
    selectedVariation = data?.variation_options?.find((o: any) =>
      isEqual(
        o.options.map((v: any) => v.value).sort(),
        Object.values(attributes).sort()
      )
    );
  }

  console.log(selectedVariation,'tesfs')
  const filterData = {
    filterDate: filterDate,
    mealType: mealType
  }
  const item = useMemo(() => { return generateCartItem(data, selectedVariation, filterData) }, [data, selectedVariation]);
  const outOfStock = isInCart(item) && !isInStock(item);
  function addToCart() {
    if (!isSelected) return;
    // to show btn feedback while product carting
    setAddToCartLoader(true);
    setTimeout(() => {
      setAddToCartLoader(false);
    }, 1500);
    //console.log('item:', item)
    //console.log('User:', user)
    let materials = item?.main_ingredients.split(", ");
    var alles: any[] = [];
    user?.allergens.filter((a: any) => materials.includes(a.name)).map((a: any) => alles.push(a.name))
    //console.log('ALert:', alles.toString())
    if(alles.toString()) {
      confirmAlert({
        title: 'Confirm to Order',
        message: `This product matchs with your saved allergens( ${alles.toString()} ).`,
        buttons: [
          {
            label: 'Yes',
            onClick: () =>{
              addItemToCart(item, selectedQuantity);
              toast(t('text-added-bag'), {
                progressClassName: 'fancy-progress-bar',
                position: width! > 768 ? 'bottom-right' : 'top-right',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
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
      addItemToCart(item, selectedQuantity);
      toast(t('text-added-bag'), {
        progressClassName: 'fancy-progress-bar',
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    
    // setAlert(`This includes some ingrediants that considers such as ${alles.toString()} for you as allergins`)
  }
  function addToWishlist() {
    setAddToWishlistLoader(true);
    setFavorite(!favorite);
    const toastStatus: string =
      favorite === true ? t('text-remove-favorite') : t('text-added-favorite');
    setTimeout(() => {
      setAddToWishlistLoader(false);
    }, 1500);
    toast(toastStatus, {
      progressClassName: 'fancy-progress-bar',
      position: width! > 768 ? 'bottom-right' : 'top-right',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  function navigateToProductPage() {
    closeModal();
    router.push(`${ROUTES.PRODUCT}/${slug}`);
  }

 function executeOnClick(isExpanded: any) {
}
  useEffect(() => setSelectedQuantity(1), [data._id]);
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

  return (
    <div className="md:w-[600px] lg:w-[940px] xl:w-[1180px] 2xl:w-[1360px] mx-auto p-1 lg:p-0 xl:p-3 bg-brand-light rounded-md">
      <CloseButton onClick={closeModal} />
      <div className="overflow-hidden">
        <div className="px-4 pt-4 md:px-6 lg:p-8 2xl:p-10 mb-9 lg:mb-2 md:pt-7 2xl:pt-10">
          <div className="items-start justify-between lg:flex xl:flex">
            <div className="items-center justify-center mb-6 overflow-hidden xl:flex md:mb-8 lg:mb-0">
              {!!gallery?.length? (selectedVariation?.image?.length
 &&                <ThumbnailCarousel gallery={gallery} imageUrl={selectedVariation?.image[0]?.thumbnail ?? productGalleryPlaceholder} />
              ) : (
                <div className="flex items-center justify-center w-auto">

                  <Image
                    src={image?.original ?? productGalleryPlaceholder}
                    alt={name!}
                    width={650}
                    height={590}
                  />
                </div>
              )}
            </div>
            <div className="shrink-0 flex flex-col lg:ltr:pl-5 lg:rtl:pr-5 xl:ltr:pl-8 xl:rtl:pr-8 2xl:ltr:pl-10 2xl:rtl:pr-10 lg:w-[430px] xl:w-[470px] 2xl:w-[480px]">
              <div className="pb-4">
                <div
                  className="mb-2 md:mb-2.5 block -mt-1.5"
                  onClick={navigateToProductPage}
                  role="button"
                >
                  <h2 className="text-lg font-medium transition-colors duration-300 text-brand-dark md:text-xl xl:text-2xl hover:text-brand">
                    {name}
                  </h2>
                </div>

                {unit && isEmpty(variations) ? (
                  <div className="text-sm font-medium md:text-15px">
                  {unit!==''?unit:''}
                  </div>
                ) : (
                  <VariationPrice
                    selectedVariation={selectedVariation}
                    minPrice={data.min_price}
                    maxPrice={data.max_price}
                  />
                )}

                {isEmpty(variations) && (
                  <div className="flex items-center mt-5">
                    <div className="text-brand-dark font-bold text-base md:text-xl xl:text-[22px]">
                      {price}
                    </div>
                    {discount && (
                      <>
                        <del className="text-sm text-opacity-50 md:text-15px ltr:pl-3 rtl:pr-3 text-brand-dark ">
                          {basePrice}
                        </del>
                        <span className="inline-block rounded font-bold text-xs md:text-sm bg-brand-tree bg-opacity-20 text-brand-tree uppercase px-2 py-1 ltr:ml-2.5 rtl:mr-2.5">
                          {discount} {t('text-off')}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {Object.keys(variations).map((variation) => {
                return (
                  <ProductAttributes
                    key={`popup-attribute-key${variation}`}
                    variations={variations}
                    attributes={attributes}
                    setAttributes={setAttributes}
                  />
                  );
              })}

              <div className="pb-2">
                {/* check that item isInCart and place the available quantity or the item quantity */}
                {isEmpty(variations) && (
                  <>
                    {Number(quantity) > 0 || !outOfStock ? (
                       Number(quantity) <= 5 && (
                        <span className="text-sm font-medium text-yellow">
                          {t('text-only') +
                            ' ' +
                            quantity +
                            ' ' +
                            t('text-left-item')}

                        </span>
                      )
                    
                    ) : (
                    <div className="text-base text-brand-danger whitespace-nowrap">
                      {t('text-out-stock')}
                    </div>
                    )}
                  </>
                )}
                {!isEmpty(selectedVariation) && (
                  <span className="text-sm font-medium text-yellow">
                    {selectedVariation?.is_disable ||
                      selectedVariation.quantity === 0
                      ? t('text-out-stock')
                      : selectedVariation.quantity <= 5 &&
                      ( `${t('text-only') +
                      ' ' +
                      selectedVariation.quantity +
                      ' ' +
                      t('text-left-item')
                      }`)}

                  </span>
                )}
              </div>

              <div className="pt-1.5 lg:pt-3 xl:pt-4 space-y-2.5 md:space-y-3.5">
                <Counter
                  variant="single"
                  value={selectedQuantity}
                  onIncrement={() => setSelectedQuantity((prev) => prev + 1)}
                  onDecrement={() =>
                    setSelectedQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
                  }
                  disabled={
                    isInCart(item)
                      ? getItemFromCart(item).quantity + selectedQuantity >=
                      Number(item.stock)
                      : selectedQuantity >= Number(item.stock)
                  }
                />
                <Button
                  onClick={addToCart}
                  className="w-full px-1.5"
                  disabled={!isSelected}
                  loading={addToCartLoader}
                >
                  <CartIcon color="#ffffff" className="ltr:mr-3 rtl:ml-3" />
                  {t('text-add-to-cart')}
                </Button>
            
              </div>
              {tag && (
                <ul className="pt-5 xl:pt-6">
          <li className="relative inline-flex items-center justify-center text-sm md:text-15px text-brand-dark text-opacity-80 ltr:mr-2 rtl:ml-2 top-1">
          <span
                    onClick={addToWishlist}
                    loading={addToWishlistLoader}
                    className={` hover:text-brand ${favorite === true && 'text-brand'
                      }`}
                  >
                    {favorite === true ? (
                      <IoIosHeart className="text-2xl md:text-[26px] ltr:mr-2 rtl:ml-2 transition-all" />
                    ) : (
                      <IoIosHeartEmpty className="text-2xl md:text-[26px] ltr:mr-2 rtl:ml-2 transition-all group-hover:text-brand" />
                    )}

                 {/*   {t('text-wishlist')}*/}
                  </span>
          </li>
          <li className="relative inline-flex items-center justify-center text-sm md:text-15px text-brand-dark text-opacity-80 ltr:mr-2 rtl:ml-2 top-1">
          <span
                      className={` hover:text-brand ${shareButtonStatus === true && 'text-brand'
                        }`}
                      onClick={handleChange}
                    >
                      <IoArrowRedoOutline className="text-2xl md:text-[26px] ltr:mr-2 rtl:ml-2 transition-all group-hover:text-brand" />
                    {/*   {t('text-share')}*/}
                    </span>
                    <SocialShareBox
                      className={`absolute z-10 ltr:right-0 rtl:left-0 w-[300px] md:min-w-[400px] transition-all duration-300 ${shareButtonStatus === true
                          ? 'visible opacity-100 top-full'
                          : 'opacity-0 invisible top-[130%]'
                        }`}
                      shareUrl={productUrl}
                    />
          </li>

                  <li className="relative inline-flex items-center justify-center text-sm md:text-15px text-brand-dark text-opacity-80 ltr:mr-2 rtl:ml-2 top-1">
                    <LabelIcon className="ltr:mr-2 rtl:ml-2" /> {t('text-tags')}
                    :
                  </li>
                  {tag?.map((item: any) => (
                    <li className="inline-block p-[3px]" key={`tag-${item._id}`}>
                      <TagLabel data={item} />
                    </li>
                  ))}
                </ul>
              )}

              <div className="pt-6 xl:pt-8">
                <Heading className="mb-3 lg:mb-3.5">
                  {t('text-product-details')}:
                </Heading>
                <ShowMoreText
                lines={1}
                more="Show more"
                less="Show less"
                className="content-css text-sm text-justify"
                anchorClass="my-anchor-css-class text-brand"
                onClick={executeOnClick}
                expanded={false}
                width={600}
                truncatedEndingComponent={"... "}
            >
               <Text variant="small">{description}</Text>
               
            </ShowMoreText>
            
              
              </div>
              <div className="pt-6 xl:pt-8">

                <Heading className="mb-3 lg:mb-3.5">
                  {t('text-main-ingredients')}:
                </Heading>
                {!isEmpty(selectedVariation) && (
                  <Text variant="small">
                    {selectedVariation.main_ingredients}
                  </Text>
                )}

                {/* for non variant product */}
                {isEmpty(selectedVariation) && (
                  <Text variant="small">
                    {main_ingredients}

                  </Text>
                )}
              </div>
              <div className="pt-6 xl:pt-8">
                <Heading className="mb-3 lg:mb-3.5">
                  {t('text-nutritional-information')}:
                </Heading>
                {/* for non variant product */}
                {isEmpty(selectedVariation) && (
                  <Text variant="small">
                    {nutritional_info}
                  </Text>
                )}
                {!isEmpty(selectedVariation) && (
                  <Text variant="small">
                    {selectedVariation.nutritional_info}
                  </Text>
                )}

              </div>
            </div>
          </div>
        </div>
        <RelatedProductFeed
          carouselBreakpoint={breakpoints}
          className="mb-0.5 md:mb-2 lg:mb-3.5 xl:mb-4 2xl:mb-6"
          slug={slug}
        />
      </div>
    </div>
  );
}

