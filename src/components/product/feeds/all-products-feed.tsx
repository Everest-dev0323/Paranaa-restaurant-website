import { ChangeEvent, Fragment, useCallback, useEffect, useState } from 'react';
import ProductCard from '@components/product/product-cards/product-card';
import type { FC } from 'react';
import { useUI } from '@contexts/ui.context';
import { useProductsQuery } from '@framework/product/get-all-products';
import ListBox from '@components/ui/filter-list-box';
import ProductCardLoader from '@components/ui/loaders/product-card-loader';
import SectionHeader from '@components/common/section-header';
import { useModalAction } from '@components/common/modal/modal.context';
import slice from 'lodash/slice';
import Alert from '@components/ui/alert';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { Router, useRouter } from 'next/router';
import { LIMITS } from '@framework/utils/limits';
import { dateIsValid, convertDateFormat } from '@utils/convertDateFormat';
import { Product } from '@framework/types';
// import { CheckBox } from '@components/ui/form/checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox'
import MenuIcon from '@components/icons/menu-icon';
import { Box, Popper } from '@mui/material';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import React from 'react';
import CloseIcon from '@components/icons/close-icon';
import PromotionIcon from '@components/icons/featured/promotion-icon';
import DeliveryIcon from '@components/icons/featured/delivery-icon';
import CartIcon from '@components/icons/cart-icon';
import LabelIcon from '@components/icons/label-icon';
import FilterIcon from '@components/icons/filter-icon';
import { Drawer } from '@components/common/drawer/drawer';
import { Tag } from '@framework/types';



interface ProductFeedProps {
  element?: any;
  className?: string;
}


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

const AllProductFeed: FC<ProductFeedProps> = ({ element, className = '' }) => {
  const { t } = useTranslation('common');
  const { category, setCategory, mealType, setMealType, filterDate, setFilterDate } = useUI();
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [disabledItem, setDisabledItem] = useState<string>('');
  const [disabledDate, setDisabledDate] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [res, setRes] = useState<string[]>([]);
  const {
    openSidebar,
    closeSidebar,
    displaySidebar,
    toggleMobileSearch,
    isAuthorized,
  } = useUI();

  const { query } = useRouter();

  const {
    isFetching: isLoading,
    isFetchingNextPage: loadingMore,
    fetchNextPage,
    hasNextPage,
    data,
    error,
  } = useProductsQuery({ limit: LIMITS.PRODUCTS_LIMITS, ...query });

  const handleChange = (event: SelectChangeEvent<typeof tagNames>) => {
    const {
      target: { value },
    } = event;
    setTagNames(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const { openModal } = useModalAction();
  function handleCategoryPopup() {
    openModal('CATEGORY_VIEW');
  }


  var datesData: any[] = [];


  var tagData: any[] = [];

  data?.pages?.map((page: any) => {
    page?.data?.map((product: any) => (
      // dates.push(product?.dates)
      tagData = tagData.concat(product?.tag)
    ));
  });

  // console.log('data:', data)
  const result1 = tagData.map(b => b.name);// get all dates properties
  let uniqueTag = Array.from(new Set(result1));

  const date = new Date();
  const hour = date.getHours();

  data?.pages?.map((page: any) => {
    page?.data?.map((product: any) => (
      // dates.push(product?.dates)
      datesData = datesData.concat(product?.dates)
    ));
  });
 // console.log(datesData)

  let result = datesData.filter(d => dateIsValid(d.date) && d.date >= date.toJSON().slice(0, 14)).map(a => new Date(convertDateFormat(a.date)).toString().slice(0, 15));// get all dates properties

  // console.log(hour,date,'demo')
  // if (hour >= 14) {
  //   date.setDate(date.getDate() + 1);
  //   result.push(date.toString().slice(0, 15))
  // } else {
  //   result.push(date.toString().slice(0, 15))
  // }

  // result.push(date.toString().slice(0, 15))
  let uniqueDates = Array.from(new Set(result));
  uniqueDates.sort(function (a, b) {
    const date1: any = new Date(a)
    const date2: any = new Date(b)
    return date1 - date2;
  })

  const changeFilterDate = (selDate: string) => {
    setFilterDate(selDate)
  }
  const changeMealType = (selMeal: string) => {
    setMealType(selMeal)
  }
  function hasAllTags(product: Product) {
    product.hasTags = 0;
    res.map((selected) => {
      let matchingtags : Tag[] = [];
       matchingtags = product.tag?.filter((t: { name: string; slug: string; }) => t.name === selected) ? product.tag?.filter((t: { name: string; slug: string; }) => t.name === selected) : []
      console.log(product.tag,selected, product.name);
       if (matchingtags?.length > 0) {
        product.hasTags = product.hasTags + 1;
      }
      else {
        product.hasTags = product.hasTags - 1;
      }
    })
    return product.hasTags === res.length;
  }

  const filterProducts = useCallback(() => {
    const date = new Date();

    if (!filterDate) { setFilterDate(date.toString().slice(0, 15)) }
    if (!uniqueDates.includes(filterDate)) {uniqueDates.length > 0 &&  setFilterDate(uniqueDates[0]) }
    if (!disabledItem) { setDisabledItem('lunch') }
    let resultProduct: any[] = [];
    data?.pages?.map((page: any) => {
      page?.data?.map((product: any) => {
        if ((category === '' || product?.category_id.toLowerCase() === category.toLowerCase()) &&
          product?.dates.some((a: { date: string; meal_type: string; }) => new Date(convertDateFormat(a.date)).toString().slice(0, 15) === filterDate
            && a.meal_type.toUpperCase() === mealType.toUpperCase())
          &&
          (res.length === 0 || product?.tag.length > 0 && hasAllTags(product))
        ) {

          resultProduct.push(product);
        }

      });
    });
    setFilteredProducts(resultProduct)
  }, [filterDate, mealType, category, data, res]);

  useEffect(() => {
    // const interval = setInterval(() => {
    const date = new Date();
    const hour = date.getHours();

    if (filterDate === date.toString().slice(0, 15)) {
      if (hour < 7) {
        setMealType('Lunch');
        setFilterDate(date.toString().slice(0, 15));
      } else if (hour >= 7 && hour < 14) {
        setDisabledItem('Lunch')
        //console.log('disabledItem', disabledItem)
        setMealType('Dinner');
        setFilterDate(date.toString().slice(0, 15));
      } else {
        setMealType('Lunch');

        setDisabledDate(date.toString().slice(0, 15))
        date.setDate(date.getDate() + 1);
        setFilterDate(date.toString().slice(0, 15));
      }
      setCategory(query?.category ? query.category : '')
      filterProducts()
    } else {
      //console.log('else')
      setDisabledItem('')

    }
    //}, 1000);

    //return () => clearInterval(interval);
  }, [filterDate, mealType]);

  /* useEffect(() => {
     const date = new Date();
     const hour = date.getHours();
     // console.log(date, hour)
     if (hour < 7) {
       setMealType('Lunch');
       setFilterDate(date.toString().slice(0, 15));
     } else if (hour >= 7 && hour < 14) {
       setDisabledItem('Lunch')
       setMealType('Dinner');
       setFilterDate(date.toString().slice(0, 15));
     } else {
       setMealType('Lunch');
       setDisabledDate(date.toString().slice(0, 15))
       date.setDate(date.getDate() + 1);
       setFilterDate(date.toString().slice(0, 15));
     }
     setCategory(query?.category ? query.category : '')
     filterProducts()
   }, [])*/

  const handleClick = (target: any) => {
    setOpen((prev) => !prev);
    //setOpen(true);
    setAnchorEl(target);
   // console.log(target);
  };
  const handleClickAway = () => {
    setOpen(false);
  };

  function handleMobileMenu() {
    return openSidebar();
  }

  const handleCheckbox = (event: ChangeEvent<HTMLInputElement>, isChecked: boolean) => {
    // console.log(isChecked, value); 
   //console.log(event.target.value, isChecked)
    //console.log(res)
    let val = event.target.value;
    { res.indexOf(val) <= -1 ? setRes(res.concat([val])) : setRes(res.filter(item => item !== val)); }
  }

  const handleClear = (event: ChangeEvent<HTMLInputElement>, isChecked: boolean) => {
    setRes([]);
  }

  useEffect(() => {
    // console.log('filterDate', filterDate)

    filterProducts()
  }, [filterDate, mealType, category, data, res])
  return (

    <div className={cn(className)}>
      {/*z-20 is overlaping the  main header*/}
      <header className="sticky  top-[4.1rem] z-10 bg-white">
        <div className="flex items-center justify-between pb-0.5 mb-3 lg:mb-3 xl:mb-4 ">
          <SectionHeader sectionHeading="" className="mb-0" />
          &nbsp;<div className="w-full h-full">
            <div className="flex justify-start">
              <select value={filterDate}  className="bg-green-500  mr-4 mt-2 text-white hover:bg-white appearance-none py-1 font-bold bg-clip-padding bg-no-repeat border border-green-600 transition ease-in-out m-0  focus:bg-green focus:text-green hover:text-gray-600 form-select form-select-sm rounded-full shadow-md hover:border-0 hover:border-green-500 focus:border-0 focus:border-green-500" id='filterDate' onChange={e => changeFilterDate(e.target.value)}>
                {
                  uniqueDates.map(d => <option  key={d} value={d} hidden={disabledDate === d ? true : false}>{d.slice(0, -5)}</option>)
                }
              </select>

              <select className="bg-green-500 mt-2 text-white hover:bg-white appearance-none py-1 font-bold bg-clip-padding bg-no-repeat border border-solid border-green-600 transition ease-in-out m-0  focus:bg-green focus:text-green hover:text-gray-600 form-select form-select-sm rounded-full shadow-md hover:border-0 hover:border-green-500 focus:border-0 focus:border-green-500" id='mealType' onChange={e => changeMealType(e.target.value)}>
                {disabledItem !== 'Lunch' && <option value="Lunch">Lunch</option>}
                {disabledItem !== 'Dinner' && <option value="Dinner">Dinner</option>}
              </select>
            </div>
          </div>
          <div className="w-full h-full  ">
            <div className="flex justify-end  ">
              <button className="lg:hidden bg-white pl-1 pr-1 py-1 hover:bg-green-500  appearance-none  font-bold bg-clip-padding bg-no-repeat border border-solid border-green-600 rounded transition ease-in-out m-0  focus:bg-green focus:text-green hover:text-white form-select form-select-sm"
                role="button"
                onClick={handleCategoryPopup}>
                <MenuIcon></MenuIcon>
              </button>&nbsp;
              <button
          aria-label="Menu"
          className="flex flex-col items-center justify-center outline-none shrink-0 focus:outline-none"
          onClick={handleMobileMenu}
        >
          <MenuIcon />
        </button>
              <button
                aria-label="Filter"
                onClick={(e) => handleClick(e.currentTarget)}
                className="flex flex-col shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] text-white items-center pl-1 pr-1 py-1 bg-green-500 justify-center outline-none shrink-0 focus:outline-none"
              >
                <FilterIcon></FilterIcon>
              </button>

              {/* <FormControl sx={{ m: 0.5, width: 200 }} size="small"></FormControl>
              <InputLabel id="demo-multiple-checkbox-label text-md" className="text-white font-bold">Filter</InputLabel>
              <Select className='bg-white hover:bg-green-500 form-select form-select-sm appearance-none py-1 font-bold  bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0  focus:bg-green focus:text-gray-500 h-8'
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={tagNames}
                onChange={handleChange}
                input={<OutlinedInput label="Filter" />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {uniqueTag.sort().map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    <Checkbox checked={tagNames.indexOf(tag) > -1} />
                    <ListItemText primary={tag} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>*/}
              {/*  <ClickAwayListener onClickAway={handleClickAway}>   */}
              <Popper
                placement="bottom-end"
                disablePortal={true}
                open={open}
                anchorEl={anchorEl}
                modifiers={[
                  {
                    name: 'flip',
                    enabled: true,
                    options: {
                      altBoundary: true,
                      rootBoundary: 'document',
                      padding: 8,
                    },
                  },
                  {
                    name: 'preventOverflow',
                    enabled: true,
                    options: {
                      altAxis: true,
                      altBoundary: true,
                      tether: true,
                      rootBoundary: 'document',
                      padding: 8,
                    },
                  }
                ]} >

                <FormControl sx={{ m: 0.5, width: 300 }} size="small">

                  <div className="max-w-sm rounded shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] bg-white overflow-hidden z-10 ">
                    <div className="px-3 py-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className='text-slate-400 font-semibold text-lg'>Filter</div>
                        <div className='flex justify-end' onClick={(e) => handleClick(e.currentTarget)}> <CloseIcon ></CloseIcon> </div>
                      </div>

                    </div>
                    <div className="px-3 pt-1 pb-1">

                      {uniqueTag.sort().map((tag) => (
                        <MenuItem key={tag} value={tag}>
                          <Checkbox value={tag} onChange={handleCheckbox} checked={res.indexOf(tag) > -1} />
                          <ListItemText primary={tag} />
                        </MenuItem>
                      ))}
                      </div>
                      <div className='py-2 px-2'>
                      <button onClick ={(e) => handleClear(e.currentTarget)} className=' w-full bg-white mt-2 text-gray-500 hover:bg-green-500 hover:text-white appearance-none py-1 px-3 font-bold bg-clip-padding bg-no-repeat border border-solid border-green-500 transition ease-in-out m-0  focus:bg-green focus:text-green rounded shadow-md'>Clear filters</button>
                      </div>
                  </div>
                </FormControl>
              </Popper>
              {/*</ClickAwayListener>*/}
            </div>
          </div>
        </div>
      </header>    {error ? (
        <Alert message={error?.message} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 md:gap-4 2xl:gap-5">

          {isLoading && !data?.pages?.length ? (
            Array.from({ length: LIMITS.PRODUCTS_LIMITS }).map((_, idx) => (
              <ProductCardLoader
                key={`product--key-${idx}`}
                uniqueKey={`product--key-${idx}`}
              />
            ))
          ) : (filteredProducts?.length ?
            <>
              {filteredProducts?.slice(0, 18)?.map((product: Product) => (
                <ProductCard
                  key={`product--key${product._id}`}
                  product={product}
                />
              ))}
            </> :
            <>
              {/* {data?.pages?.map((page: any, index) => {
                return (
                  <Fragment key={index}>
                    {page?.data?.slice(0, 18)?.map((products: Product) => (
                      <ProductCard
                        key={`product--key${products._id}`}
                        product={products}
                      />
                    ))}
                    {element && <div className="col-span-full">{element}</div>}
                    {page?.data?.length! > 18 &&
                      slice(page?.data, 18, page?.data?.length).map(
                        (filteredProducts: any) => (
                          <ProductCard
                            key={`product--key${filteredProducts._id}`}
                            product={filteredProducts}
                          />
                        )
                      )}
                  </Fragment>

                );
              })} */}
              <span>There is no filtering result.</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AllProductFeed;


