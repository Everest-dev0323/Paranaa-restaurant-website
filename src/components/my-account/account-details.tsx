import Input from '@components/ui/form/input';
import Button from '@components/ui/button';
import Heading from '@components/ui/heading';
import { useForm, Controller } from 'react-hook-form';
import { QueryClient } from 'react-query';
import { useEffect, useState } from "react";
import { useUpdateUserMutation, UpdateUserType } from '@framework/customer/use-update-customer';
import { useTranslation } from 'next-i18next';
import { getUser } from '@framework/customer/use-update-customer';

const defaultValues = {};
const AccountDetails: React.FC = () => {
  const queryClient = new QueryClient();

  //const userobj = JSON.parse(localStorage.getItem('user') || '{}');
  //console.log(userobj, 'userobj');
  //const [userobj,setuserobj] = useLocalStorage('user'  || '{}');
  //console.log(userobj, 'userobj, accountdetails');
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UpdateUserType>();
  const { mutate: updateUser, isLoading } = useUpdateUserMutation();
  //const { mutate: getUser } = usegetUser();
  const [user, setUser] = useState<any>({});
  useEffect(() => {
    // Perform localStorage action
    const userid = localStorage.getItem('user')
    const getUserData = async () => {
      if (userid) {
        const userData = await getUser(JSON.parse(userid)._id)
        setUser(userData);
        setValue("username", userData.username);
        setValue("mobile", userData.mobile);
        setValue("dob", userData.dob);
        setValue("refer_code", userData.refer_code);
        setValue("email", userData.email);
      }
    }
    getUserData()
  }, [])

  const { t } = useTranslation();

  // console.log(getUser("62b953a9c4ea229f692cbc86"),'errors');

  function onSubmit(input: UpdateUserType) {
    // console.log({...user, ...input})
    let updateData = { ...user, ...input };
    !updateData.password && delete updateData.password
    !updateData.confirmPassword && delete updateData.confirmPassword
    updateUser({ ...user, ...input });
  }
  return (
    <div className="flex flex-col w-full">
      <Heading variant="titleLarge" className="mb-5 md:mb-6 lg:mb-7 lg:-mt-1">
        {t('common:text-account-details-personal')}
      </Heading>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center w-full mx-auto"
        noValidate
      >
        <div className="border-b border-border-base pb-7 md:pb-8 lg:pb-10">
          <div className="flex flex-col space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
              <Input
                defaultValue={user.username}
                // value= "test"
                label={t('forms:label-username')}
                {...register('username')}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
              // error={errors.username?.message}
              />
              <Input
                type="tel"
                defaultValue={user?.mobile}
                label={t('forms:label-phone')}
                {...register('mobile')}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
              // error={errors.mobile?.message}
              />
            </div>
            <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">

              <Input
                type="date"
                defaultValue={user?.dob}
                label={t('forms:label-dob')}
                {...register('dob')}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
              />
              <Input
                defaultValue={user?.refer_code}
                label={t('forms:refer-code')}
                {...register('refer_code')}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
              />
            </div>

          </div>
        </div>
        <Heading
          variant="titleLarge"
          className="pt-6 mb-5 xl:mb-8 md:pt-7 lg:pt-8"
        >
          {t('common:text-account-details-account')}
        </Heading>
        <div className="border-b border-border-base pb-7 md:pb-9 lg:pb-10">
          <div className="flex flex-col space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
              <Input
                type="email"
                disabled
                label={t('forms:label-email-star')}
                {...register('email')}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
              // error={errors.email?.message}
              />
            </div>
            {/* <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
              <PasswordInput
                type="tel"
                label={t('forms:label-password')}
                {...register('password', {
                  required: 'forms:password-required',
                })}
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={errors.password?.message}
              />
              <PasswordInput
                label={t('forms:label-confirm-password')}
                {...register('confirmPassword', {
                  required: 'forms:password-required',
                })}
                error={errors.confirmPassword?.message}
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
              />
            </div> */}
          </div>
        </div>
        {/*<div className="relative flex pt-6 md:pt-8 lg:pt-10">
          <div className="ltr:pr-2.5 rtl:pl-2.5">
            <Heading className="mb-1 font-medium">
              {t('common:text-share-profile-data')}
            </Heading>
            <Text variant="small">
              {t('common:text-share-profile-data-description')}
            </Text>
          </div>
          <div className="ltr:ml-auto rtl:mr-auto">
            <Controller
              name="shareProfileData"
              control={control}
              defaultValue={true}
              render={({ field: { value, onChange } }) => (
                <Switch onChange={onChange} checked={value} />
              )}
            />
          </div>
        </div>*/}
        {/*<div className="relative flex mt-5 mb-1 md:mt-6 lg:mt-7 sm:mb-4 lg:mb-6">
          <div className="ltr:pr-2.5 rtl:pl-2.5">
            <Heading className="mb-1 font-medium">
              {t('common:text-ads-performance')}
            </Heading>
            <Text variant="small">
              {t('common:text-ads-performance-description')}
            </Text>
          </div>
          <div className="ltr:ml-auto rtl:mr-auto">
            <Controller
              name="setAdsPerformance"
              control={control}
              defaultValue={true}
              render={({ field: { value, onChange } }) => (
                <Switch onChange={onChange} checked={value} />
              )}
            />
          </div>
        </div>*/}
        <div className="relative flex pb-2 mt-5 sm:ltr:ml-auto sm:rtl:mr-auto lg:pb-0">
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            variant="formButton"
            className="w-full sm:w-auto"
          >
            {t('common:button-save-changes')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;
