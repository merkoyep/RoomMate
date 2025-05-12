import { View, ScrollView, Text, RefreshControl } from 'react-native';
import TransactionRow from './TransactionRow';
import { Transaction } from '../CreateTransaction/CreateTransactionFormComponent';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { useGetTransactions } from './useGetTransactions';

const TransactionContainer = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { refetch } = useGetTransactions();
  const transactions = useSelector(
    (state: any) => state.transactions.transactions
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text>No transactions found</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-white'>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3b82f6']} // This matches your blue color scheme
            tintColor='#3b82f6'
          />
        }
      >
        {transactions.map((transaction: Transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} />
        ))}
      </ScrollView>
    </View>
  );
};

export default TransactionContainer;
