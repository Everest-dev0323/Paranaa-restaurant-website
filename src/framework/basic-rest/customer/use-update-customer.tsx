import { useMutation ,useQuery } from 'react-query';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import http from '@framework/utils/http';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';

export interface UpdateUserType {
  username: string;
  //lastName: string;
  //displayName: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  dob: string;
  refer_code : string;
  //shareProfileData: boolean;
  //setAdsPerformance: boolean;
}

export async function getUser(input: String)  {
  const { data } = await http.get(API_ENDPOINTS.USER+"/"+input);
  // console.log(data,'data');
  return data;
}  

async function updateUser(input: UpdateUserType) {
  const { data } = await http.post(API_ENDPOINTS.REGISTER, input);
  console.log(data)
  return data;
}  

export const useUpdateUserMutation = () => {
  const { width } = useWindowSize()
  return useMutation((input: UpdateUserType) => updateUser(input), {
    onSuccess: (data) => {
      toast('Account was successfully updated', {
        progressClassName: 'fancy-progress-bar',
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // console.log(data, 'UpdateUser success response');
    },
    onError: (data) => {
      // console.log(data, 'UpdateUser error response');
      toast('Error occured while updating', {
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
{/*export const usegetUser = () => {
  return useMutation(() => getUser(), {
    onSuccess: (data) => {
      console.log(data, 'Get User success response');
    },
    onError: (data) => {
      console.log(data, 'Get User error response');
    },
  });
};*/}





