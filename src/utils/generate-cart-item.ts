import isEmpty from 'lodash/isEmpty';
import { dateIsValid, convertDateFormat } from '@utils/convertDateFormat';
import { TiVolumeMute } from 'react-icons/ti';
interface Item {
  _id: string | number;
  name: string;
  slug: string;
  main_ingredients: string;
  image: {
    thumbnail: string;
    [key: string]: unknown;
  };
  dates: {
    date: string;
    [key: string]: unknown;
  }[];
  price: number;
  sale_price?: number;
  quantity?: number;
  [key: string]: unknown;
}
interface Variation {
  _id: string | number;
  title: string;
  price: number;
  sale_price?: number;
  quantity: number;
  [key: string]: unknown;
}
interface Filter {
  filterDate: string;
  mealType: string;
}
export function generateCartItem(item: Item, variation: Variation, filter: Filter) {
  let { _id, name, slug, image, price, main_ingredients, sale_price, quantity, unit, dates } = item;
  if(!isEmpty(filter)) {
    dates = dates.filter(d => new Date(convertDateFormat(d.date)).toString().slice(0, 15) === filter?.filterDate && d.meal_type === filter?.mealType)
  }
  if (!isEmpty(variation)) {
    return {
      _id: `${_id}.${variation._id}`,
      productId: _id,
      name: `${name} - ${variation.title}`,
      slug,
      main_ingredients,
      unit,
      dates,
      stock: variation.quantity,
      price: variation.sale_price ? variation.sale_price : variation.price,
      image,
      variationId: variation._id,
    };
  }
  return {
    _id,
    name,
    slug,
    main_ingredients,
    unit,
    image,
    dates,
    stock: quantity,
    price: sale_price ? sale_price : price,
  };
}
