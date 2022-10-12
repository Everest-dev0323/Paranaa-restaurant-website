import { useEffectOnce, useSessionStorage } from 'react-use';
import Image from '@components/ui/image';
import HighlightedBar from '@components/common/highlighted-bar';
import Countdown from '@components/common/countdown';
import Header from '@components/layout/header/header';
import Footer from '@components/layout/footer/footer';
import { useTranslation } from 'next-i18next';
import MobileNavigation from '@components/layout/mobile-navigation/mobile-navigation';
import { useState, useEffect, useCallback } from 'react';

const Layout: React.FC = ({ children }) => {
  const [isNextDay, setIsNextDay] = useState(false)
  const [countTime, setCountTime] = useState(new Date().getUTCDate())
  const { t } = useTranslation('common');
  const [highlightedBar, setHighlightedBar] = useSessionStorage(
    'pranaa-highlightedBar',
    'false'
  );
  const date = new Date()
  const [meal_type, setMealType] = useState('');
  const [time, setTime] = useState('');

  function getDifferenceInHours(date1: any, date2: any) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs;
  }
  const init = useCallback(() => {
    const hour = date.getHours()
    let diff;
    if (hour > 7 && hour <= 13) {
      // date.setUTCHours(16, 0, 0, 0);
      setMealType('Dinner');
      setTime('02:00 PM');
      //set date
      const newdate = new Date();
      newdate.setDate(newdate.getDate() + 1);
      //set time
      newdate.setUTCHours(14);
      newdate.setUTCMinutes(0);
      newdate.setUTCMilliseconds(0);
      diff = getDifferenceInHours(date, newdate);

    } else {
      setIsNextDay(true)
      setMealType('Lunch');
      setTime('07:00 AM');
      /*if (date.getUTCHours() < 4) {
        date.setUTCHours(16, 0, 0, 0);
      } else {
        date.setUTCHours(40, 0, 0, 0);
      }*/
      const newdate = new Date(Date.now());
      newdate.setDate(newdate.getDate() + 1);
      //set time
      newdate.setHours(7);
      newdate.setMinutes(0);
      newdate.setMilliseconds(0);
      diff = getDifferenceInHours(date, newdate);
    }
    setCountTime(Date.now() + diff)

    // console.log(date.getTime())
  }, [date])

  useEffect(() => {
    init()
  }, [])

  return (
    <div className="flex flex-col min-h-screen ">
      {highlightedBar !== 'true' && (
        <HighlightedBar onClose={() => setHighlightedBar('true')}>
          <div className="flex items-center">
            <div className="hidden sm:flex shrink-0 items-center justify-center bg-brand-light w-9 h-9 rounded-full ltr:mr-2.5 rtl:ml-2.5">
              <Image
                width={23}
                height={23}
                src="/assets/images/delivery-box.svg"
                alt="Delivery Box"
              />
            </div>
            <p
              dangerouslySetInnerHTML={{
                __html: isNextDay ? t('text-highlighted-bar-1', { variable: meal_type, time: time }) : t('text-highlighted-bar', { variable: meal_type, time: time }),
              }}
            />

          </div>
          <Countdown date={countTime} key={date.toString()}
          />
        </HighlightedBar>
      )}
      {/* End of highlighted bar  */}

      <Header />
      <main
        className="relative flex-grow"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </main>
      <Footer />
      <MobileNavigation />
    </div>
  );
};

export default Layout;
