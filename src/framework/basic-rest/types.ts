import { QueryKey } from 'react-query';

export type CollectionsQueryOptionsType = {
  text?: string;
  collection?: string;
  status?: string;
  limit?: number;
};

export type CategoriesQueryOptionsType = {
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
};
export type ProductsQueryOptionsType = {
  type: string;
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
};
export type QueryOptionsType = {
  text?: string;
  category?: string;
  filterDate?: string;
  slug?: string;
  status?: string;
  limit?: number;
};

export type QueryParamsType = {
  queryKey: QueryKey;
  pageParam?: string;
};
export type Attachment = {
  _id: string | number;
  thumbnail: string;
  original: string;
};
export type Category = {
  _id: number | string;
  name: string;
  slug: string;
  details?: string;
  image?: Attachment;
  icon?: string;
  children?: [Category];
  products?: Product[];
  productCount?: number;
  [key: string]: unknown;
};
export type Collection = {
  _id: number | string;
  name: string;
  slug: string;
  details?: string;
  image?: Attachment;
  icon?: string;
  products?: Product[];
  productCount?: number;
};
export type Brand = {
  _id: number | string;
  name: string;
  slug: string;
  image?: Attachment;
  [key: string]: unknown;
};
export type Dietary = {
  _id: number | string;
  name: string;
  slug: string;
  [key: string]: unknown;
};
export type Tag = {
  _id: string | number;
  name: string;
  slug: string;
};
export type Product = {
  _id: number | string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  sold: number;
  unit: string;
  sale_price?: number;
  min_price?: number;
  max_price?: number;
  image?: Attachment[]; 
  sku?: string;
  gallery?: Attachment[];
  category?: Category;
  tag?: Tag[];
  meta?: any[];
  brand?: Brand;
  dates?: Dates[];
  description?: string;
  variations?: object;
  [key: string]: unknown;
};
export type OrderItem = {
  _id: number | string;
  name: string;
  price: number;
  quantity: number;
};
export type Order = {
  _id: string | number;
  name: string;
  slug: string;
  products: OrderItem[];
  total: number;
  tracking_number: string;
  customer: {
  _id: number;
    email: string;
  };
  shipping_fee: number;
  payment_gateway: string;
};

export type ShopsQueryOptionsType = {
  text?: string;
  shop?: Shop;
  status?: string;
  limit?: number;
};

export type Shop = {
  _id: string | number;
  owner_id: string | number;
  owner_name: string;
  address: string;
  phone: string;
  website: string;
  ratings: string;
  name: string;
  slug: string;
  description: string;
  cover_image: Attachment;
  logo: Attachment;
  socialShare: any;
  created_at: string;
  updated_at: string;
};

export type Dates = {
  _id: number | string;
  date: string;
  meal_type: string;
  status: string;
};
export type User = {
  _id: number | string;
  username: string;
  email: string;
  notif_email: boolean;
  notif_sms: boolean;
  total_referrals: number;
  total_orders: number;
  wallet_balance: number;
 // allergens?: Allergens[];
  //favourite?: Favourite[];
  [key: string]: unknown;
};
