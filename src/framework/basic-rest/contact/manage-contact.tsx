import { useUI } from '@contexts/ui.context';
import Cookies from 'js-cookie';
import { useMutation } from 'react-query';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import http from '@framework/utils/http';
import { useModalAction } from '@components/common/modal/modal.context';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
//import shuffle from 'lodash/shuffle';
//import { useInfiniteQuery } from 'react-query';

export interface ContactInputType {
    _id?: string; 
    title?: string;
    default?: boolean;
    user_id?: string;
    address?: string;
    mobile?: string;
    contact?: string;
    status?: string;
    email?: string;
    values: {
      title: string;
      value: string;
    }[];
    [key: string]: unknown;
}
async function updateContact(input: ContactInputType) {
  const id =  input._id;
  delete input._id;
  var data:any = {}
  if(id) {
    data = await http.put(API_ENDPOINTS.CONTACT+'/'+id, input);
  } else {
    data = await http.post(API_ENDPOINTS.CONTACT, input);
  }
  // console.log(data.data, 'login response');
  return {
    contact:  data.data
    //token: `${input.email}.${input.name}`.split('').reverse().join(''),
  };
}

export const useUpdateContactMutation = () => {
  const { authorize } = useUI();
  const { closeModal } = useModalAction();
  const { width } = useWindowSize()
  return useMutation((input: ContactInputType) => updateContact(input), {
    onSuccess: (data) => {
    //   Cookies.set('contact', data);
      // authorize();
      //closeModal();
      toast('Contact Info was successfully updated', {
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
      console.log(data, 'Contact error response');
      toast('Error occured while updating the contact info', {
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

async function deleteContact(item: any) {

  var data:any = {}
  if(item._id) {
    data = await http.delete(API_ENDPOINTS.CONTACT+'/'+item._id);
  } else {
    console.log('Some error in input')
  }
  
  console.log(data, 'delete response');
  return {
    message:  data.data
    //token: `${input.email}.${input.name}`.split('').reverse().join(''),
  };
}

export const useDeleteContactMutation = () => {
  // const { authorize } = useUI();
  const { closeModal } = useModalAction();
  const { width } = useWindowSize()
  return useMutation((input: ContactInputType) => deleteContact(input), {
    onSuccess: (data) => {
      console.log(data, 'deleteId')
      toast('Contact info was successfully deleted', {
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
      console.log(data, 'contact error response');
      toast('Error occured while deleting the contact info', {
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
 