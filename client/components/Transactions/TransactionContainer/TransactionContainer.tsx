import { View, ScrollView, Text } from 'react-native';
import TransactionRow from './TransactionRow';
import { Transaction } from '../CreateTransaction/CreateTransactionFormComponent';
import { useSelector } from 'react-redux';

const TransactionContainer = () => {
  const transactions = useSelector(
    (state: any) => state.transactions.transactions
  );

  if (!transactions || transactions.length === 0) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text>No transactions found</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-white'>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {transactions.map((transaction: Transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} />
        ))}
      </ScrollView>
    </View>
  );
};

export default TransactionContainer;
