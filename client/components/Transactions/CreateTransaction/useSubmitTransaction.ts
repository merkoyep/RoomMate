import { useMutation } from '@apollo/client';
import { CREATE_TRANSACTION } from '../../../graphql/mutations';
import { useSplit } from './useSplit';
import { useSelector } from 'react-redux';

export const useSubmitTransaction = () => {
  const { convertSplitsToArray } = useSplit();
  const transactionForm = useSelector((state: any) => state.transactionForm);
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const [createTransaction, { loading, error }] =
    useMutation(CREATE_TRANSACTION);

  const submitTransaction = async () => {
    try {
      console.log('Current user:', currentUser);
      console.log('Current user ID:', currentUser._id || currentUser.id);
      const splitArray = convertSplitsToArray().map((split) => {
        console.log('Split before conversion:', split);
        console.log('Split userId type:', typeof split.userId);
        console.log('Split userId value:', split.userId);
        const converted = {
          userId: String(split.userId),
          percent: Number(split.percent),
          value: Number(split.value),
        };
        console.log('Split after conversion:', converted);
        return converted;
      });

      console.log('Final split array:', splitArray);
      console.log('Paid by value:', transactionForm.paidBy);
      console.log('Paid by type:', typeof transactionForm.paidBy);

      const response = await createTransaction({
        variables: {
          title: transactionForm.title,
          amount: Number(transactionForm.amount),
          type: transactionForm.type,
          category: transactionForm.category,
          paidBy: String(transactionForm.paidBy),
          splits: splitArray,
          description: transactionForm.description,
          date: new Date().toISOString(),
          user: String(currentUser._id || currentUser.id),
        },
      });
      console.log('Sending transaction type:', transactionForm.type);

      return response.data.createTransaction;
    } catch (err) {
      console.error('Error creating transaction:', err);
      throw err;
    }
  };

  return {
    submitTransaction,
    loading,
    error,
  };
};
