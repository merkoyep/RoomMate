import { useQuery } from '@apollo/client';
import { GET_TRANSACTIONS } from '../../../graphql/queries';

export const useGetTransactions = () => {
  const { data, loading, error, refetch } = useQuery(GET_TRANSACTIONS);
  return { data, loading, error, refetch };
};
