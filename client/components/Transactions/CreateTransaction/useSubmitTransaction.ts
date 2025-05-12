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
      let splitArray = convertSplitsToArray().map((split) => {
        const converted = {
          userId: String(split.userId),
          percent: Number(split.percent),
          value: Number(split.value),
        };
        return converted;
      });

      if (transactionForm.type === 'payment') {
        splitArray = [
          {
            userId: String(transactionForm.save),
            percent: Number(100),
            value: Number(transactionForm.amount),
          },
        ];
      }

      const response = await createTransaction({
        variables: {
          title: transactionForm.title,
          amount: Number(transactionForm.amount),
          type: transactionForm.type,
          category:
            transactionForm.type === 'payment'
              ? 'Payment'
              : transactionForm.category,
          paidBy: String(transactionForm.paidBy),
          splits: splitArray,
          description: transactionForm.description,
          transactionDate: transactionForm.transactionDate,
          user: String(currentUser._id || currentUser.id),
        },
      });

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
