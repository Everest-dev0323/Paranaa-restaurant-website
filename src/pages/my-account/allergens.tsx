import Layout from '@components/layout/layout';
import AccountLayout from '@components/my-account/account-layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Allergens from '@components/my-account/allergens';
import { GetStaticProps } from 'next';
import Seo from '@components/seo/seo';

export default function AllergensPage() {
  return (
    <>
      <Seo
        title="Allergens"
        description="The best healthy food delivery in Bangkok."
        path="my-account/allergens"
      />
      <AccountLayout>
        <Allergens  />
      </AccountLayout>
    </>
  );
}

AllergensPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        'common',
        'forms',
        'menu',
        'terms',
        'faq',
        'footer',
      ])),
    },
  };
};
