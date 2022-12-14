  //const host = 'http://aaronsoftech.in:5001/'
const host = 'http://localhost:5001/'
  //const host= 'http://saayash.com:5001/'
export const API_ENDPOINTS = {
  LOGIN: host+'api/auth/login',
  REGISTER: host+'api/auth/register',
  LOGOUT: '../api/logout',
  FORGET_PASSWORD: '../api/forget-password',
  CATEGORIES: host+'api/categories',
  DIETARY: host+'api/allergens',
  BRANDS: host+'api/brand',
  PRODUCTS: host+'api/products',
  PRODUCT: host+'api/product',
  RELATED_PRODUCTS: host+'api/products',
  FLASH_SELL_PRODUCTS: '../api/products_flash_sell.json',
  BEST_SELLER_PRODUCTS: host+'api/products',
  BEST_SELLER_GROCERY_PRODUCTS: host+'api/products',
  POPULAR_PRODUCTS: host+'api/products',
  COOKIES_PRODUCTS: host+'api/products',
  CHIPS_PRODUCTS: host+'api/products',
  POPCORN_JERKY_PRODUCTS: host+'api/products',
  FRESH_VEGETABLES_PRODUCTS: host+'api/products',
  SEARCH: host+'api/products',
  ORDERS: '../api/orders.json',
  ORDER: '../api/order.json',
  ORDER_STATUS: host+'api/orderstatus',
  ADDRESS: host+'api/address',
  ALLERGENS: host+'api/allergens',
  PAYMENT: '../api/payment.json',
  CONTACT: host+'api/contactinfo',
  SHOP: '../api/shop.json',
  SHOPS: '../api/shops.json',
  WISHLIST: host+'api/users',
  USER: host+'api/users/find',
  ZIPCODE: host+'api/zipcode',
  UPLOAD: host+'api/uploads',
  FILES: host+'files',
  //WISHLIST: '../api/wishlist.json',
  //for specific user use this users/find/{id}
};
