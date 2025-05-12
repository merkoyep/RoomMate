import { useSelector } from 'react-redux';
import { Split } from '../CreateTransaction/CreateTransactionFormComponent';

interface TransactionWithSplits {
  splits: Split[];
  amount: string;
  type: string;
  paidBy: {
    id: string;
  };
}

export const useNetValue = ({
  transaction,
}: {
  transaction: TransactionWithSplits;
}) => {
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const userId = currentUser?.id;
  const split = transaction.splits.find(
    (split) => split.userId === currentUser?.id
  );
  const splitValue = Number(split?.value) || 0;
  const amount = Number(transaction.amount);

  const secondSplit = transaction.splits.find(
    (split) => split.userId !== currentUser?.id
  );
  const secondSplitValue = Number(secondSplit?.value) || 0;

  if (transaction.type === 'Expense') {
    if (transaction.paidBy.id === userId) {
      return secondSplitValue;
    } else {
      return splitValue * -1;
    }
  } else {
    return transaction.paidBy.id === userId ? amount : -amount;
  }
};
