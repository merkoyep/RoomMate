import { useMutation } from '@apollo/client';
import { DELETE_TRANSACTION } from '../../../graphql/mutations';
import { useDispatch } from 'react-redux';
import {
  deleteTransaction as deleteTransactionAction,
  triggerRefresh,
} from '../../../redux/store/transactionSlice';

export const useDeleteTransaction = () => {
  const dispatch = useDispatch();
  const [deleteTransactionMutation, { loading, error }] =
    useMutation(DELETE_TRANSACTION);

  const deleteTransaction = async (id: string) => {
    try {
      const { data } = await deleteTransactionMutation({
        variables: { id },
      });

      if (data.deleteTransaction) {
        dispatch(deleteTransactionAction(id));
        dispatch(triggerRefresh());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  return { deleteTransaction, loading, error };
};
