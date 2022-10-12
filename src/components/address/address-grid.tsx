import { useState } from 'react';
import { TiPencil, TiDeleteOutline } from 'react-icons/ti';
import { AiOutlinePlus, AiOutlineCheckCircle } from 'react-icons/ai';
import { RadioGroup } from '@headlessui/react';
import { useModalAction } from '@components/common/modal/modal.context';
import { formatAddress } from '@utils/format-address';
import Button from '@components/ui/button';
import { useTranslation } from 'next-i18next';
import {
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} from '@framework/address/update-address';

const AddressGrid: React.FC<{ address?: any }> = ({ address }) => {
  const { t } = useTranslation('common');
  const { openModal, closeModal } = useModalAction();
  const { mutate: updateAddress, isLoading } = useUpdateAddressMutation();
  const { mutate: deleteAddress } = useDeleteAddressMutation();

  function handlePopupView(item: any) {
    openModal('ADDRESS_VIEW_AND_EDIT', item);
  }
  const updateDefault = (item: any) => {
    console.log({ ...item, ...{ default: true } });
    if (address?.length > 0) {
      address?.map((val: any, index: any) =>
        updateAddress({ ...val, ...{ default: false } })
      );
    }
    updateAddress({ ...item, ...{ default: true } });
  };

  const removeAddress = (item: any) => {
    deleteAddress(item);
  };

  const handleSaveChange = () => {
    closeModal();
  };

  address = address || [];
  const [selected, setSelected] = useState(address[0]);
  return (
    <div className="flex flex-col justify-between h-full -mt-4 text-15px md:mt-0">
      <RadioGroup
        value={selected}
        onChange={setSelected}
        className="space-y-4 md:grid md:grid-cols-2 md:gap-5 auto-rows-auto md:space-y-0"
      >
        <RadioGroup.Label className="sr-only">{t('address')}</RadioGroup.Label>
        {address?.length > 0 ? (
          address?.map((item: any, index: any) => (
            <RadioGroup.Option
              key={index}
              value={item}
              className={({ checked }) =>
                `${checked ? 'border-brand' : 'border-border-base'}
                  border-2 relative focus:outline-none rounded-md p-5 block min-h-[112px] h-full group address__box`
              }
            >
              <RadioGroup.Label
                as="h3"
                className="mb-2 -mt-1 font-semibold text-brand-dark "
              >
                {item?.title}
                {item?.default ? (
                  <span className="text-green-500 ml-2 ">Default</span>
                ) : (
                  <button onClick={() => updateDefault(item)}>
                    {' '}
                    <AiOutlineCheckCircle
                      className="ml-2"
                      title="Set as default"
                    />
                  </button>
                )}
              </RadioGroup.Label>
              <RadioGroup.Description
                as="div"
                className="leading-6 text-brand-muted"
              >
                {item?.address[0].formatted_address}
              </RadioGroup.Description>
              <div className="absolute z-10 flex transition-all ltr:right-3 rtl:left-3 top-3 lg:opacity-0 address__actions">
                <button
                  onClick={() => handlePopupView(item)}
                  className="flex items-center justify-center w-6 h-6 text-base rounded-full bg-brand text-brand-light text-opacity-80"
                >
                  <span className="sr-only">{t(item?.title)}</span>
                  <TiPencil />
                </button>
              </div>
              <div className="absolute z-10 flex transition-all ltr:right-3 rtl:left-3 bottom-3 lg:opacity-0 address__actions">
                <button
                  onClick={() => removeAddress(item)}
                  className="flex items-center justify-center w-6 h-6 text-base rounded-full bg-brand text-brand-light text-opacity-80"
                >
                  <span className="sr-only">{t(item?.title)}</span>
                  <TiDeleteOutline />
                </button>
              </div>
            </RadioGroup.Option>
          ))
        ) : (
          <div className="border-2 border-border-base rounded font-semibold p-5 px-10 text-brand-danger flex justify-start items-center min-h-[112px] h-full">
            {t('text-no-address-found')}
          </div>
        )}
        <button
          className="w-full border-2 transition-all border-border-base rounded font-semibold p-5 px-10 cursor-pointer text-brand flex justify-start hover:border-brand items-center min-h-[112px] h-full"
          onClick={() => handlePopupView(undefined)}
        >
          <AiOutlinePlus size={18} className="ltr:mr-2 rtl:ml-2" />
          {t('text-add-address')}
        </button>
      </RadioGroup>

      <div className="flex mt-5 sm:justify-end md:mt-10 lg:mt-20 save-change-button">
        <Button className="w-full sm:w-auto" onClick={handleSaveChange}>
          {t('button-save-changes')}
        </Button>
      </div>
    </div>
  );
};

export default AddressGrid;
