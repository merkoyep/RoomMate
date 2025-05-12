import { View, Text } from 'react-native';
import { Transaction } from '../CreateTransaction/CreateTransactionFormComponent';
import { useSelector } from 'react-redux';
import { Split } from '../CreateTransaction/CreateTransactionFormComponent';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../../../graphql/queries';

export const ReadTransactionContainer = ({
  transaction,
  onClose,
}: {
  transaction: Transaction;
  onClose: () => void;
}) => {
  const { data, loading, error } = useQuery(GET_USERS);
  const currentUser = useSelector((state: any) => state.user.currentUser);

  if (loading) return <Text>Loading users...</Text>;
  if (error) return <Text>Error loading users: {error.message}</Text>;

  const users = data?.getUsers || [];

  return (
    <View>
      <View className='flex flex-row items-center justify-start gap-2'>
        <Text className='text-lg font-semibold'>{transaction.title}</Text>
        <Text
          className='text-base'
          style={{
            color: transaction.type === 'expense' ? 'red' : 'green',
          }}
        >
          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
        </Text>
      </View>
      <Text className='text-base'>{transaction.description}</Text>
      <Text className='text-xl font-semibold pt-3'>Category</Text>
      <Text className='text-base'>{transaction.category}</Text>
      <Text className='text-xl font-semibold pt-3'>Amount</Text>
      <Text className='text-base'>${transaction.amount}</Text>
      <Text className='text-xl font-semibold pt-3'>Splits</Text>
      {Object.entries(transaction.splits).map(([userId, split]) => {
        const splitObj: Split = split;
        return (
          <View key={userId} className='flex flex-row justify-between py-1'>
            <Text className='text-base'>
              {users.find((u: any) => u.id === splitObj.userId)?.username}
            </Text>
            <Text key={userId}>
              ${Number(splitObj.value).toFixed(2)} ({splitObj.percent}%)
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default ReadTransactionContainer;
