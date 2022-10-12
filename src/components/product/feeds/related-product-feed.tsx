import ProductsCarousel from '@components/product/products-carousel';
// import { useRelatedProductsQuery } from '@framework/product/get-related-product';
import { useProductsQuery } from '@framework/product/get-all-products'
import { LIMITS } from '@framework/utils/limits';
import { Router, useRouter } from 'next/router';
import { useUI } from '@contexts/ui.context';
import { dateIsValid, convertDateFormat } from '@utils/convertDateFormat';

interface RelatedProductsProps {
  carouselBreakpoint?: {} | any;
  className?: string;
  uniqueKey?: string;
  slug?: string;
}

const RelatedProductFeed: React.FC<RelatedProductsProps> = ({
  carouselBreakpoint,
  className,
  uniqueKey = 'related-product-popup',
  slug,
}) => {
  const { query } = useRouter();
  const { category, mealType, filterDate} = useUI();
  // const { data, isLoading, error } = useRelatedProductsQuery({
  //   limit: LIMITS.RELATED_PRODUCTS_LIMITS,
  // });
  const {
    data, isLoading, error
  } = useProductsQuery({ limit: LIMITS.PRODUCTS_LIMITS, ...query });

  let resultProduct:any[] = []
  data?.pages?.map((page: any) => {
    page?.data?.map((product: any) => {
      if ((category === '' || product?.category_id.toLowerCase() === category.toLowerCase()) &&
        product?.dates.some((a: { date: string; meal_type: string; }) => new Date(convertDateFormat(a.date)).toString().slice(0, 15) === filterDate && a.meal_type === mealType) &&
        product?.slug !== slug) {
        resultProduct.push(product);
      }
    });
  });
  return (
    <ProductsCarousel
      sectionHeading="text-also-available"
      categorySlug="/?category="
      className={className}
      products={resultProduct}
      loading={isLoading}
      error={error?.message}
      limit={LIMITS.RELATED_PRODUCTS_LIMITS}
      uniqueKey={uniqueKey}
      carouselBreakpoint={carouselBreakpoint}
    />
  );
};

export default RelatedProductFeed;
