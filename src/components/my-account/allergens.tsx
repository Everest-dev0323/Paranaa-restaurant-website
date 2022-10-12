import Layout from '@components/layout/layout';
import Heading from '@components/ui/heading';
import Image from '@components/ui/image';
import Button from '@components/ui/button';
import { useTranslation } from 'next-i18next';
import { getUser } from '@framework/customer/use-update-customer';
import { useEffect, useState, useMemo } from "react";
import {useDietaryQuery} from '@framework/dietary/get-all-dietary'
import { useUpdateUserMutation, UpdateUserType } from '@framework/customer/use-update-customer';

export default function Allergens() {
    //   const { t } = useTranslation('legal');
    let { data, isLoading } = useDietaryQuery({});
    const { mutate: updateUser } = useUpdateUserMutation();

    const [allergens, setAllergens] = useState<any[]>([]);
    const [user, setUser] = useState<any>();
    useEffect(() => {
      // Perform localStorage action
      const userid = localStorage.getItem('user')
      const getUserData = async() => {
        if (userid) {
          const userData = await getUser(JSON.parse(userid)._id)
          setUser(userData);
          setAllergens(userData.allergens);
        }
      }
      getUserData()
    }, [])
    const { t } = useTranslation();

    const addAllergens = (item: any) => {
        const indexOfObject = allergens.findIndex(object => {
            return object.name === item.name;
          });
        if(indexOfObject < 0) {
            setAllergens([...allergens, item]);
        } else {
            setAllergens(allergens.filter(a => a.name !== item.name))
        }
    }

    // useEffect(() => {
    //     console.log(allergens)
    // }, [allergens])

    const updateUserAllergens = () => {
        console.log(allergens)
        let allergensData = {
            allergens: allergens
        }
        updateUser({...user, ...allergensData })
    }
    return (
        <>
            <div className="lg:max-h-[575px] lg:overflow-scroll scrollbar">
                <Heading variant="titleLarge">
                    Allergens Setting
                </Heading>
                <div className="pt-6 grid grid-cols-4 gap-4">
                    {!isLoading && data?.dietary.data.map((a, index) => (
                        <div key={`allerginList-${index}`} className={`${allergens.find(item => item.name === a.name) ? `border-green-500` : `border-inherit`} border-2 rounded cursor-pointer`}
                        onClick={()=>addAllergens(a)}>
                            <Image
                                width={200}
                                height={200}
                                src={a.image as string}
                                alt={a.name}
                            />
                            <div className='text-center py-2 bg-gray-200'>
                                <span>{a.name}</span>
                            </div>
                        </div>
                    )
                    )}
                </div>
                <div>
                 {/*   <button type="button"
                     className="bg-indigo-500 rounded cursor-pointer p-3 mt-5 text-white" onClick={updateUserAllergens}>
                        Save
                    </button>
                    */}
                            <div className="relative flex justify-end pb-2 mt-5 sm:ltr:ml-auto sm:rtl:mr-auto lg:pb-0">

          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            variant="formButton"
            onClick={updateUserAllergens}
            className="w-full sm:w-auto"
          >
            {t('common:button-save-changes')}
          </Button>
          </div>
                </div>
            </div>
        </>
    );
}

Allergens.Layout = Layout;
