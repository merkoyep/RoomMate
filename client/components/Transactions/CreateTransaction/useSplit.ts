import { useSelector } from 'react-redux';

interface Split {
  percent: string;
  value: string;
}

interface SplitInput {
  userId: string;
  percent: number;
  value: number;
}

export const useSplit = () => {
  const transactionForm = useSelector((state: any) => state.transactionForm);

  const convertSplitsToArray = (): SplitInput[] => {
    const splits = transactionForm.splits as { [key: string]: Split };
    console.log('Raw splits from form:', splits);
    return Object.entries(splits)
      .filter(([_, split]) => split.percent && split.value)
      .map(([userId, split]) => {
        const userIdStr =
          typeof userId === 'object' && userId !== null
            ? (userId as any)._id || (userId as any).id
            : userId;
        return {
          userId: String(userIdStr),
          percent: Number(split.percent),
          value: Number(split.value),
        };
      });
  };

  const convertArrayToSplits = (splitArray: number[], totalAmount: number) => {
    const newSplits: { [userId: string]: Split } = {};
    Object.keys(transactionForm.splits).forEach((userId, index) => {
      const value = splitArray[index] || 0;
      const percent = totalAmount
        ? ((value / totalAmount) * 100).toFixed(2)
        : '0';
      newSplits[userId] = {
        percent,
        value: value.toFixed(2),
      };
    });
    return newSplits;
  };

  return {
    transactionForm,
    convertSplitsToArray,
    convertArrayToSplits,
  };
};
