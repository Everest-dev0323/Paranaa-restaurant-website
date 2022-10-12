import { QueryOptionsType, Dietary } from '@framework/types';
import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery, useMutation } from 'react-query';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';

export interface ZipcodeInputType {
  label:string;
  th_label:string;
  value: string;
}
export const fetchZipcodes = async ({ queryKey }: any) => {
  const [_key, _params] = queryKey;
  const {
    data,
  } = await http.get(API_ENDPOINTS.ZIPCODE);
//   console.log(data, 'api')
  return { zipcode: data };
};
export const useZipcodeQuery = (options: QueryOptionsType) => {
  return useQuery<{ zipcode: any[] }, Error>(
    [API_ENDPOINTS.ZIPCODE, options],
    fetchZipcodes
  );
};
//console.log('useZipcodeQuery', useZipcodeQuery);


async function updateZipcode(input: ZipcodeInputType) {
  const { data } = await http.post(API_ENDPOINTS.ZIPCODE, input);
  console.log(data, 'Zipcode');
  return { zipcode: data };
}
export const useUpdateZipcodeQuery = () => {
  const { width } = useWindowSize()
  return useMutation((input: ZipcodeInputType) => updateZipcode(input), {
    onSuccess: (data) => {
      toast('Zipcode was successfully added', {
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
      toast('Error occuring on adding of zipcode', {
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
