import { useUI } from '@contexts/ui.context';
import Cookies from 'js-cookie';
import { useMutation } from 'react-query';
//import { QueryOptionsType, Product } from '@framework/types';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import http from '@framework/utils/http';
import { useModalAction } from '@components/common/modal/modal.context';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
//import shuffle from 'lodash/shuffle';
//import { useInfiniteQuery } from 'react-query';

export interface AddressInputType {
    _id?: string; 
    title: string;
    default: boolean;
    user_id: string;
    address: {
      lat: number;
      lng: number;
      formatted_address?: string;
      [key: string]: unknown;
    }[];
    [key: string]: unknown;
}
async function updateAddress(input: AddressInputType) {
  const id =  input._id;
  delete input._id;
  var data:any = {}
  if(id) {
    data = await http.put(API_ENDPOINTS.ADDRESS+'/'+id, input);
  } else {
    data = await http.post(API_ENDPOINTS.ADDRESS, input);
  }
  // console.log(data.data, 'login response');
  return {
    address:  data.data
    //token: `${input.email}.${input.name}`.split('').reverse().join(''),
  };
}

export const useUpdateAddressMutation = () => {
  const { authorize } = useUI();
  const { closeModal } = useModalAction();
  const { width } = useWindowSize()
  return useMutation((input: AddressInputType) => updateAddress(input), {
    onSuccess: (data) => {
      Cookies.set('address', data);
      // authorize();
      //closeModal();
      toast('Address was successfully updated', {
        progressClassName: 'fancy-progress-bar',
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    onError: (data) => {
      console.log(data, 'login error response');
      toast('Error occured while updating the address', {
        progressClassName: 'fancy-progress-bar',
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });
};

async function deleteAddress(item: any) {

  var data:any = {}
  if(item._id) {
    data = await http.delete(API_ENDPOINTS.ADDRESS+'/'+item._id);
  } else {
    console.log('Some error in input')
  }
  
  console.log(data, 'delete response');
  return {
    message:  data.data
    //token: `${input.email}.${input.name}`.split('').reverse().join(''),
  };
}

export const useDeleteAddressMutation = () => {
  // const { authorize } = useUI();
  const { closeModal } = useModalAction();
  const { width } = useWindowSize()
  return useMutation((input: AddressInputType) => deleteAddress(input), {
    onSuccess: (data) => {
      // Cookies.set('address', data);
      // authorize();
      //closeModal();
      console.log(data.message, 'deleteId')
      toast('Address was successfully deleted', {
        progressClassName: 'fancy-progress-bar',
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    onError: (data) => {
      console.log(data, 'login error response');
      toast('Error occured while deleting the address', {
        progressClassName: 'fancy-progress-bar',
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });
};
 