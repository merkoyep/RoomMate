import { useSelector } from 'react-redux';
import { Transaction } from '../components/Transactions/CreateTransaction/CreateTransactionFormComponent';

export const useCalculateWallet = () => {
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const transactions = useSelector(
    (state: any) => state.transactions?.transactions || []
  );

  const calculateWallet = () => {
    let total = 0;
    transactions.forEach((transaction: Transaction) => {
      const userId = currentUser?.id;
      const split = transaction.splits.find((split) => split.userId === userId);
      const splitValue = Number(split?.value) || 0;
      const amount = Number(transaction.amount);

      const secondSplit = transaction.splits.find(
        (split) => split.userId !== userId
      );
      const secondSplitValue = Number(secondSplit?.value) || 0;

      if (transaction.type === 'Expense') {
        if (transaction.paidBy.id === userId) {
          total += secondSplitValue;
        } else {
          total += splitValue;
        }
      } else {
        total += transaction.paidBy.id === userId ? amount : -amount;
      }
    });
    return total;
  };

  return { calculateWallet };
};

export default useCalculateWallet;
