import CloseButton from '@components/ui/close-button';
import Input from '@components/ui/form/input';
import Button from '@components/ui/button';
import { useForm } from 'react-hook-form';
import {
  useModalState,
  useModalAction,
} from '@components/common/modal/modal.context';
import { useTranslation } from 'next-i18next';
import { useUpdateContactMutation, ContactInputType } from '@framework/contact/manage-contact';

interface ContactFormValues {
  title: string;
  mobile: string;
  default: boolean;
}

const AddContactForm: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useModalState();
  const { closeModal } = useModalAction();
  const { mutate: updateContact, isLoading } = useUpdateContactMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInputType>({
    defaultValues: {
      title: data || data?.title ? data?.title : '',
      mobile: data || data?.mobile ? data?.mobile : '',
      default: data || data?.default ? data?.default : '',
    },
  });

  function onSubmit(values: ContactInputType) {
    if(data?._id) {
      const newContact = {...data, ...values}
      updateContact(newContact);
    } else {
      updateContact(values);
    }
    // console.log(data, 'sss')
    // console.log({...data, ...values})
    // const newContact = {...data, ...values}
    // updateContact(newContact);
    closeModal()
  }

  return (
    <div className="w-full md:w-[510px] mx-auto p-5 sm:p-8 bg-brand-light rounded-md">
      <CloseButton onClick={closeModal} />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-6">
          <Input
            variant="solid"
            label="forms:label-contact-title"
            {...register('title', { required: 'forms:contact-title-required' })}
            error={errors.title?.message}
          />
        </div>
        <div className="mb-6">
          <Input
            variant="solid"
            label="forms:label-contact-number"
            {...register('mobile', {
              required: 'forms:contact-number-required',
            })}
            error={errors.mobile?.message}
          />
        </div>
        <div className="mb-6">
          <input
            id="default-contact-number"
            type="checkbox"
            className="w-5 h-5 transition duration-500 ease-in-out border border-gray-300 rounded cursor-pointer form-checkbox focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none focus:checked:bg-brand hover:checked:bg-brand checked:bg-brand"
            {...register('default')}
          />
          <label
            htmlFor="default-contact-number"
            className="text-sm align-middle cursor-pointer ltr:ml-3 rtl:mr-3 text-brand-muted"
          >
            {t('common:text-default-contact-number')}
          </label>
        </div>
        <Button className="h-11 md:h-12 w-full mt-1.5" type="submit">
          {t('common:text-save-number')}
        </Button>
      </form>
    </div>
  );
};

export default AddContactForm;
