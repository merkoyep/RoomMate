import { View, Text, Pressable } from 'react-native';
import type { Transaction } from '../CreateTransaction/CreateTransactionFormComponent';

const TransactionRow = ({ transaction }: { transaction: Transaction }) => {
  const onPress = () => {
    console.log('Transaction Row Pressed');
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Pressable
      className='w-full h-20 border-2 border-gray-500 px-4 py-3 mb-2 rounded-lg pressed:bg-gray-100 bg-white'
      onPress={onPress}
    >
      <View className='flex-row justify-between items-center h-full'>
        <View className='flex-col items-start gap-1'>
          <View className='flex-row items-center justify-start'>
            <Text className='text-base font-semibold'>{transaction.title}</Text>
            <Text
              className='text-sm ml-2'
              style={{
                color: transaction.type === 'Expense' ? 'red' : 'green',
              }}
            >
              {transaction.type}
            </Text>
          </View>
          <Text className='text-sm text-gray-600'>
            {formatDate(transaction.createdAt)}
          </Text>
        </View>
        <View className='flex-col items-end'>
          <Text className='text-base font-semibold'>${transaction.amount}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default TransactionRow;
