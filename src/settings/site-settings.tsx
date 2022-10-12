import { ILFlag } from '@components/icons/language/ILFlag';
import { SAFlag } from '@components/icons/language/SAFlag';
import { CNFlag } from '@components/icons/language/CNFlag';
import { USFlag } from '@components/icons/language/USFlag';
import { DEFlag } from '@components/icons/language/DEFlag';
import { ESFlag } from '@components/icons/language/ESFlag';
import { THFlag } from '@components/icons/language/THFlag';



export const siteSettings = {
  name: 'Pranaa Food',
  description:
    'The best healthy food delivery in Bangkok',
  author: {
    name: 'Aaron Softech Private Limited.',
    websiteUrl: 'https://aaronsoftech.com',
    address: '',
  },
  logo: {
    url: '/assets/images/logo.svg',
    alt: 'Pranaa Food Logo',
    href: '/',
    width: 150,
    height: 50,
  },
  defaultLanguage: 'en',
  currencyCode: 'THB',
  site_header: {
    menu: [
      {
        id: 1,
        path: 'http://localhost:3000/',
        label: 'Home'
       /* subMenu: [
          {
            id: 1,
            path: '/',
            label: 'menu-modern',
          },
          {
            id: 2,
            path: '/classic',
            label: 'menu-classic',
          },
          {
            id: 3,
            path: '/vintage',
            label: 'menu-vintage',
          },
          {
            id: 4,
            path: '/standard',
            label: 'menu-standard',
          },
          {
            id: 5,
            path: '/minimal',
            label: 'menu-minimal',
          },
          {
            id: 6,
            path: '/trendy',
            label: 'menu-trendy',
          },
          {
            id: 7,
            path: '/elegant',
            label: 'menu-elegant',
          },
          {
            id: 8,
            path: '/refined',
            label: 'menu-refined',
          },
        ],*/
      },
      {
        id: 2,
        path: '/promos',
        label: 'Promos'
       /* subMenu: [
          {
            id: 1,
            path: '/search',
            label: 'menu-fresh-vegetables',
          },
          {
            id: 2,
            path: '/search',
            label: 'menu-diet-nutrition',
          },
          {
            id: 3,
            path: '/search',
            label: 'menu-healthy-foods',
          },
          {
            id: 4,
            path: '/search',
            label: 'menu-grocery-items',
          },
          {
            id: 5,
            path: '/search',
            label: 'menu-beaf-steak',
          },
        ],*/
      },
      {
        id: 3,
        path: '/delivery-zones',
        label: 'Delivery Zones'
       /* subMenu: [
          {
            id: 1,
            path: '/search',
            label: 'menu-vegetarian',
          },
          {
            id: 2,
            path: '/search',
            label: 'menu-kakogenic',
          },
          {
            id: 3,
            path: '/search',
            label: 'menu-mediterranean',
          },
          {
            id: 4,
            path: '/search',
            label: 'menu-organic',
          },
        ],*/
      },
      {
        id: 4,
        path: '/help',
        label: 'Help',
      },
      {
        id: 5,
        path: '/buy_credits/',
        label: 'Buy Credits',
      }
     
    ],
    languageMenu: [
      /*{
        id: 'ar',
        name: 'عربى - AR',
        value: 'ar',
        icon: <SAFlag />,
      },
      {
        id: 'zh',
        name: '中国人 - ZH',
        value: 'zh',
        icon: <CNFlag />,
      },*/
      {
        id: 'en',
        name: 'English',
        value: 'en',
        icon: <USFlag />,
      },
      {
        id: 'th',
        name: 'Thai',
        value: 'th',
        icon: <THFlag />,
      },
    /*  {
        id: 'he',
        name: 'rעברית - HE',
        value: 'he',
        icon: <ILFlag />,
      },
      {
        id: 'es',
        name: 'Español - ES',
        value: 'es',
        icon: <ESFlag />,
      },*/
    ],
  },
};
