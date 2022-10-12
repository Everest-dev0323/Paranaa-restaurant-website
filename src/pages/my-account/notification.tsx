import Layout from '@components/layout/layout';
import AccountLayout from '@components/my-account/account-layout';
import Notifications from '@components/my-account/notification';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import Seo from '@components/seo/seo';

export default function Notification() {
  return (
    <>
      <Seo
        title="Notification"
        description="The best healthy food delivery in Bangkok."
        path="my-account/notification"
      />
      <AccountLayout>
        <Notifications />
      </AccountLayout>
    </>
  );
}

Notification.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        'common',
        'forms',
        'menu',
        'footer',
      ])),
    },
  };
};
