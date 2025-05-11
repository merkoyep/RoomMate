import { useSelector } from 'react-redux';

export const useCalculateWallet = () => {
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const transactions = useSelector(
    (state: any) => state.transactions?.transactions || []
  );

  const calculateWallet = () => {
    if (!currentUser || !transactions) return 0;

    const wallet = transactions.reduce((acc: number, transaction: any) => {
      const userSplit = transaction.splits.find(
        (split: any) => split.userId === currentUser.id
      );

      if (!userSplit) {
        console.log('No split found for user in transaction:', transaction.id);
        return acc;
      }

      const splitValue = Number(userSplit.value) || 0;
      const transactionAmount = Number(transaction.amount) || 0;

      switch (true) {
        case transaction.type === 'Expense' &&
          transaction.paidBy.id === currentUser.id:
          const owed = transactionAmount - splitValue;
          return acc + owed;
        case transaction.type === 'Expense' &&
          transaction.paidBy.id !== currentUser.id:
          return acc - splitValue;
        case transaction.type === 'Payment' &&
          transaction.paidBy.id === currentUser.id:
          return acc + transactionAmount;
        case transaction.type === 'Payment' &&
          transaction.paidBy.id !== currentUser.id:
          return acc - transactionAmount;
        default:
          return acc;
      }
    }, 0);
    return wallet;
  };

  return { calculateWallet };
};

export default useCalculateWallet;
