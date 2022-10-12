import Layout from '@components/layout/layout';
import CheckoutCard from '@components/checkout/checkout-card';
import Container from '@components/ui/container';
import CheckoutDetails from '@components/checkout/checkout-details';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Divider from '@components/ui/divider';
import Seo from '@components/seo/seo';
import { useState } from 'react';

export default function CheckoutPage() {
  const [tipVal, setTipVal] = useState<number>(10);
  return (
    <>
      <Seo
        title="Checkout"
        description="The best healthy food delivery in Bangkok."
        path="checkout"
      />
      <Container className="py-10 border-t 2xl:py-12 border-border-base checkout">
        <div className="flex flex-col mx-auto xl:max-w-screen-xl">
          <div className="flex flex-col flex-wrap grid-cols-1 gap-x-7 xl:gap-x-8 lg:grid lg:grid-cols-12">
            <div className="w-full col-start-1 col-end-9">
              <CheckoutDetails setTipValue={setTipVal} />
            </div>
            <div className="w-full col-start-9 col-end-13 mt-7 lg:mt-0">
              <CheckoutCard tip={tipVal} />
            </div>
          </div>
        </div>
      </Container>
      <Divider />
    </>
  );
}

CheckoutPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'forms',
        'menu',
        'footer',
      ])),
    },
  };
};
