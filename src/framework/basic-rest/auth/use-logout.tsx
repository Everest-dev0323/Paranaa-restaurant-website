import { useUI } from '@contexts/ui.context';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { useCart } from '@contexts/cart/cart.context';
import { useMutation } from 'react-query';

export interface LoginInputType {
  email: string;
  password: string;
  remember_me: boolean;
}
async function logout() {
  return {
    ok: true,
    message: 'Logout Successful!',
  };
}
export const useLogoutMutation = () => {
  const { resetCart } = useCart();
  const { unauthorize } = useUI();
  return useMutation(() => logout(), {
    onSuccess: (_data) => {
      Cookies.remove('auth_token');
      localStorage.removeItem('user');
      resetCart();
      unauthorize();
      Router.push('/');
    },
    onError: (data) => {
      console.log(data, 'logout error response');
    },
  });
};
