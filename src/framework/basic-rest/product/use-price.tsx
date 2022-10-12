import { useMemo } from 'react';

export function formatPrice({
  amount,
  currencyCode,
  locale,
}: {
  amount: number;
  currencyCode: string;
  locale: string;
}) {
  const formatCurrency = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: currencyCode,
    maximumSignificantDigits: 10,
  });
  // console.log(locale)
  // console.log(currencyCode)

  return formatCurrency.format(amount);
}

export function formatVariantPrice({
  amount,
  baseAmount,
  currencyCode,
  locale,
}: {
  baseAmount: number;
  amount: number;
  currencyCode: string;
  locale: string;
}) {
  const hasDiscount = baseAmount > amount;
  const formatDiscount = new Intl.NumberFormat('th-TH', { style: 'percent' });
  const discount = hasDiscount
    ? formatDiscount.format((baseAmount - amount) / baseAmount)
    : null;

  const price = formatPrice({ amount, currencyCode, locale });
  const basePrice = hasDiscount
    ? formatPrice({ amount: baseAmount, currencyCode, locale })
    : null;

  return { price, basePrice, discount };
}

export default function usePrice(
  data?: {
    amount: any;
    baseAmount?: number;
    currencyCode: string;
  } | null
) {
  const { amount, baseAmount } = data ?? {};
  // console.log(amount,baseAmount, currencyCode ,'testing')
  const currencyCode = 'THB';

  const locale = 'th-TH';
  const value = useMemo(() => {
    // if (isNaN(amount) || !currencyCode) return '';
    if (!currencyCode) return '';

    return baseAmount
      ? formatVariantPrice({ amount, baseAmount, currencyCode, locale })
      : formatPrice({ amount, currencyCode, locale });
  }, [amount, baseAmount, currencyCode]);
  return typeof value === 'string'
    ? { price: value, basePrice: null, discount: null }
    : value;
}
