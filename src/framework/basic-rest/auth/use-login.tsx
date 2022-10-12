import { useUI } from '@contexts/ui.context';
import Cookies from 'js-cookie';
import { useMutation } from 'react-query';
//import { QueryOptionsType, Product } from '@framework/types';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import http from '@framework/utils/http';
import { useModalAction } from '@components/common/modal/modal.context';

//import shuffle from 'lodash/shuffle';
//import { useInfiniteQuery } from 'react-query';

export interface LoginInputType {
  email: string;
  password: string;
  remember_me: boolean;
}
async function login(input: LoginInputType) {
  const { data } = await http.post(API_ENDPOINTS.LOGIN, input);
  const user  = {"username":data.username,"email":data.email, "_id":data._id};
  localStorage.setItem('user', JSON.stringify(user));

  return {
    accessToken:  data.accessToken,
   // data: data
   // accessToken: `${input.email}.${input.remember_me}`.split('').reverse().join(''),
  };
}

export const useLoginMutation = () => {
  const { authorize } = useUI();
  const { closeModal } = useModalAction(); 
  return useMutation((input: LoginInputType) => login(input), {
    onSuccess: (data) => {
     // debugger;
      Cookies.set('auth_token', data.accessToken);
     // localStorage.setItem('user_details', JSON.stringify(data));
      //
      authorize();
      closeModal();
    
      console.log(data, 'login response');

    },
    onError: (data) => {
      // debugger;
     console.log(data, 'login error response');

    }
  });
};
