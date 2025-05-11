import { View, ScrollView, Text } from 'react-native';
import TransactionRow from './TransactionRow';
import { Transaction } from '../CreateTransaction/CreateTransactionFormComponent';
import { useGetTransactions } from './useGetTransactions';

const TransactionContainer = () => {
  const { data, loading, error } = useGetTransactions();

  if (loading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text>Loading transactions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text>Error loading transactions: {error.message}</Text>
      </View>
    );
  }

  if (!data?.getTransactions) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text>No transactions found</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-white'>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {data.getTransactions.map((transaction: Transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} />
        ))}
      </ScrollView>
    </View>
  );
};

export default TransactionContainer;
