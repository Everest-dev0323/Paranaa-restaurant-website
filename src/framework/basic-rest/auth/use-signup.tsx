import { useUI } from '@contexts/ui.context';
import Cookies from 'js-cookie';
import { useMutation } from 'react-query';
//import { QueryOptionsType, Product } from '@framework/types';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import http from '@framework/utils/http';
import { useModalAction } from '@components/common/modal/modal.context';

//import shuffle from 'lodash/shuffle';
//import { useInfiniteQuery } from 'react-query';

export interface SignUpInputType {
  zipcode:string;
  email: string;
  password: string;
  username: string;
  remember_me: boolean;
  refer_code: string;
}
async function signUp(input: SignUpInputType) {
  const { data } = await http.post(API_ENDPOINTS.REGISTER, input);
  console.log(data, 'login response');
  const user  = {"username":data.username,"email":data.email, "_id":data._id};
  localStorage.setItem('user', JSON.stringify(user));
  return {
    accessToken:  data.accessToken
    //token: `${input.email}.${input.name}`.split('').reverse().join(''),
  };
}
export const useSignUpMutation = () => {
  const { authorize } = useUI();
  const { closeModal } = useModalAction();
  return useMutation((input: SignUpInputType) => signUp(input), {
    onSuccess: (data) => {
      Cookies.set('auth_token', data.accessToken);
      authorize();
      //closeModal();
    },
    onError: (data) => {
      console.log(data, 'login error response');
    },
  });
};
 