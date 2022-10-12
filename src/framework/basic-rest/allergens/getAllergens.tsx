import http from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';

const fetchAllergens = async () => {
  const { data } = await http.get(API_ENDPOINTS.ALLERGENS);
  return {
    data: data,
  };
};

const useAllergensQuery = () => {
  return useQuery([API_ENDPOINTS.ALLERGENS], fetchAllergens);
};

export { useAllergensQuery, fetchAllergens };