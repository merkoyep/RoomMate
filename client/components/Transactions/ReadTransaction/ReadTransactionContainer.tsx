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
      <View className='flex flex-col justify-start border-b-2 border-gray-300 pb-2'>
        <View className='flex flex-row items-center'>
          <Text className='text-lg font-semibold pr-2'>
            {transaction.title}
          </Text>
          <Text
            className='text-base'
            style={{
              color: transaction.type === 'expense' ? 'red' : 'green',
            }}
          >
            {transaction.type.charAt(0).toUpperCase() +
              transaction.type.slice(1)}
          </Text>
        </View>
        <Text className='text-base'>{transaction.description}</Text>
      </View>
      <View className='flex flex-row items-center justify-between'>
        <Text className='text-sm text-gray-500'>Paid By</Text>
        <Text className='text-base'>{transaction.paidBy.username}</Text>
      </View>
      {transaction.type !== 'Payment' && (
        <View className='flex flex-row items-center justify-between'>
          <Text className='text-sm text-gray-500'>Category</Text>
          <Text className='text-base'>{transaction.category}</Text>
        </View>
      )}
      {transaction.type !== 'Payment' && (
        <View className='flex flex-col'>
          <Text className='text-sm text-gray-500'>Splits</Text>
          {Object.entries(transaction.splits).map(([userId, split]) => {
            const splitObj = split as Split;
            return (
              <View key={userId} className='flex flex-row justify-between py-1'>
                <Text className='text-base px-2'>
                  {users.find((u: any) => u.id === splitObj.userId)?.username}
                </Text>
                <View className='flex flex-col items-end'>
                  <Text className='text-base' key={userId}>
                    ${splitObj.value}
                  </Text>
                  <Text
                    className='text-sm text-gray-500'
                    key={`${userId}-percent`}
                  >
                    ({splitObj.percent}%)
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
      <View className='flex flex-row items-center justify-between'>
        <Text className='text-sm text-gray-500'>Total Amount</Text>
        <Text className='text-base'>
          ${Number(transaction.amount).toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

export default ReadTransactionContainer;
