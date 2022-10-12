import Layout from '@components/layout/layout';
import Heading from '@components/ui/heading';
import { Router, useRouter } from 'next/router';
import Image from '@components/ui/image';
import { useTranslation } from 'next-i18next';
import { getUser } from '@framework/customer/use-update-customer';
import { useEffect, useState, useMemo } from "react";
import { useWishlistProductsQuery } from '@framework/product/get-wishlist-product'
import { useUpdateUserMutation, UpdateUserType } from '@framework/customer/use-update-customer';
import { useProductsQuery } from '@framework/product/get-all-products';
import ProductWishlistGrid from '@components/product/wishlist-product';
import { LIMITS } from '@framework/utils/limits';
import { Product } from '@framework/types';



export default function Wishlist() {
  // let { data, isLoading } = useWishlistProductsQuery({});
  const { mutate: updateUser } = useUpdateUserMutation();
  const { query } = useRouter();

  const {
    isFetching: isLoading,
    isFetchingNextPage: loadingMore,
    fetchNextPage,
    hasNextPage,
    data,
    error,
  } = useProductsQuery({ limit: LIMITS.PRODUCTS_LIMITS, ...query });


  const [wishlist, setWishlist] = useState<any[]>([]);
  const [user, setUser] = useState<any>();
  useEffect(() => {
    // Perform localStorage action
    const userid = localStorage.getItem('user')
    const getUserData = async () => {
      if (userid) {
        const userData = await getUser(JSON.parse(userid)._id)
        setUser(userData);
        setWishlist(userData.favourite);
      }
    }
    getUserData()
  }, [])
 // console.log(wishlist, 'wishlist');
  //console.log(wishlist[0].product_id, 'wishlist.product_id');

  let productArray: Product[] = [];
  data?.pages?.map((page: any) => {
    page?.data?.map((product: any) => (
      productArray.push(product)
      ));
});

wishlist.map((item) => {
  item.product = productArray.find((product) => product._id === item.product_id)
})
console.log(wishlist,'tesdgfkhj');

const addWishlist = (item: any) => {
  const indexOfObject = wishlist.findIndex(object => {
    return object.name === item.name;
  });
  if (indexOfObject < 0) {
    setWishlist([...wishlist, item]);
  } else {
    setWishlist(wishlist.filter(a => a.name !== item.name))
  }
}

// useEffect(() => {
//     console.log(allergens)
// }, [allergens])

const updateUserWishlist = () => {
  console.log(wishlist)
  let wishlistData = {
    favourite: wishlist
  }
  updateUser({ ...user, ...wishlistData })
}
return (
  <div className="flex flex-col pt-8 2xl:pt-12">
    <ProductWishlistGrid data={wishlist} />
  </div>
);
}

Wishlist.Layout = Layout;

