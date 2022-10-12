import { useState, useEffect } from 'react';
import Input from '@components/ui/form/input';
import Button from '@components/ui/button';
import TextArea from '@components/ui/form/text-area';
import ListBox from '@components/ui/form/select-box';
import { useForm } from 'react-hook-form';
import { useModalState } from '@components/common/modal/modal.context';
import { useModalAction } from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import Heading from '@components/ui/heading';
import { UiFileInputButton } from '@components/ui/form/image-upload';
import Map from '@components/ui/map';
import { useTranslation } from 'next-i18next';
import { useUpdateAddressMutation, AddressInputType } from '@framework/address/update-address';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import axios from 'axios';

interface AddressFormValues {
  title: string;
  default: boolean;
  lat: number;
  lng: number;
  formatted_address?: string;
  type: string;
  building_name: string;
  building_number: string;
  street_name: string;
  street_number: string;
  mobile_number: string;
  backup_mobile_number: string;
  instruction: string;
  image: string;
}

const AddAddressForm: React.FC = () => {
  const { t } = useTranslation();
  const { mutate: updateAddress, isLoading } = useUpdateAddressMutation();
  const { data } = useModalState();
  const [photo, setPhoto] = useState('')

  const { closeModal } = useModalAction();

  function onSubmit(values: AddressFormValues, e: any) {
    var addressData = {
      _id: data?._id,
      title: values.title,
      default: values.default || false,
      user_id: JSON.parse(localStorage.getItem('user')!)?._id || '',
      type: values.type,
      address: [{
        lat: values.lat || 1.295831,
        lng: values.lng || 103.76261,
        formatted_address: values.formatted_address,
        building_name: values.building_name,
        building_number: values.building_number,
        street_name: values.street_name,
        street_number: values.street_number,
        mobile_number: values.mobile_number,
        backup_mobile_number: values.backup_mobile_number,
        instruction: values.instruction,
        image: values.image,
      }]
    }
    console.log(addressData)
    updateAddress(addressData);
    closeModal()
  }
  console.log(data)
  
  useEffect(() => {
    const fetchImage = async() => {
      if(data?.address[0]?.image) {
        setPhoto(API_ENDPOINTS.FILES+'/'+data?.address[0]?.image)
      }
    }
    fetchImage()
  }, [data])
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddressFormValues>({
    defaultValues: {
      title: data || data?.title ? data?.title : '',
      type: data?.type,
      building_name: data?.address[0]?.building_name,
      building_number: data?.address[0]?.building_number,
      street_name: data?.address[0]?.street_name,
      street_number: data?.address[0]?.street_number,
      mobile_number: data?.address[0]?.mobile_number,
      backup_mobile_number: data?.address[0]?.backup_mobile_number,
      instruction: data?.address[0]?.instruction,
      formatted_address:
        data || data?.address[0]?.formatted_address
          ? data?.address[0]?.formatted_address
          : '',
      default: data || data?.default ? data?.default : '',
      image: data?.address[0]?.image,
    },
  });

  const onChange = async (formData: any) => {
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event: any) => {
        console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
      },
    };

    const response = await axios.post(API_ENDPOINTS.UPLOAD, formData, config);

    setValue('image', response.data.data);
    setPhoto(API_ENDPOINTS.FILES+'/'+ response.data.data)
  };

  return (
    <div className="w-full md:w-[600px] lg:w-[900px] xl:w-[1000px] mx-auto p-5 sm:p-8 bg-brand-light rounded-md">
      <CloseButton onClick={closeModal} />
      <Heading variant="title" className="mb-8 -mt-1.5">
        {t('common:text-add-delivery-address')}
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className='columns-6'></div>
        <div className='columns-6'></div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor='type'
              className={`block font-normal text-sm leading-none mb-3 cursor-pointer text-brand-dark text-opacity-70`}
            >
              {'Type'}
            </label>
            <select {...register("type")} id="type" className='rounded'>
              <option value="">Select...</option>
              <option value="Orders">Orders</option>
              <option value="Contract">Contract</option>
              <option value="Delivery">Delivery</option>
            </select>
          </div>
          <Input
            variant="solid"
            label="Address Title"
            {...register('title', { required: 'Title Required' })}
            error={errors.title?.message}
          />
        </div>
        <div className="grid grid-cols-1 mb-6 gap-7">
          <Map
            lat={data?.address[0]?.lat || 13.7511592}
            lng={data?.address[0]?.lng || 100.571878}
            height={'420px'}
            zoom={19}
            showInfoWindow={false}
            mapCurrentPosition={(value: string, position: any) => {
                setValue('formatted_address', value)
                setValue('lat', position.lat)
                setValue('lng', position.lng)
              }
            }
          />
        </div>
        <div className='grid grid-cols-1 gap-4 mb-6'>
          <TextArea
            label="Address"
            {...register('formatted_address', {
              required: 'forms:address-required',
            })}
            error={errors.formatted_address?.message}
            className="text-brand-dark"
            variant="solid"
          />
        </div>
        <div className='grid grid-cols-2 gap-4 mb-6'>
          <Input
            variant="solid"
            label="Building Name"
            {...register('building_name')}
          />
          <Input
            variant="solid"
            label="Building Number"
            {...register('building_number')}
          />
        </div>
        <div className='grid grid-cols-2 gap-4 mb-6'>
          <Input
            variant="solid"
            label="Street Name"
            {...register('street_name')}
          />
          <Input
            variant="solid"
            label="Street Number"
            {...register('street_number')}
          />
        </div>
        <div className='grid grid-cols-2 gap-4 mb-6'>
          <Input
            variant="solid"
            label="Mobile Name"
            {...register('mobile_number')}
          />
          <Input
            variant="solid"
            label="Backup Mobile Number"
            {...register('backup_mobile_number')}
          />
        </div>
        <div className='grid grid-cols-2 gap-4 mb-6'>
          <TextArea
            label="Delivery Instruction"
            {...register('instruction')}
            className="text-brand-dark"
            variant="solid"
          />
          <div>
            <UiFileInputButton
              {...register('image')}
              label="Upload Drop Point Image"
              uploadFileName="file"
              onChange={onChange}
            />
            <img src={photo} />
          </div>
          
        </div>
        <div className="flex justify-end w-full">
          <Button className="h-11 md:h-12 mt-1.5" type="submit">
            {t('common:text-save-address')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddAddressForm;
