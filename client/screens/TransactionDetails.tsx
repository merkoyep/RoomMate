import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Transaction } from '../components/Transactions/CreateTransaction/CreateTransactionFormComponent';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

interface Split {
  userId: string;
  percent: number;
  value: number;
}

interface TransactionWithSplits extends Omit<Transaction, 'splits'> {
  splits: Split[];
}

type RootStackParamList = {
  TransactionDetails: { transaction: TransactionWithSplits };
};

type Props = NativeStackScreenProps<RootStackParamList, 'TransactionDetails'>;

const TransactionDetails = ({ route }: Props) => {
  const { transaction } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <View style={{ flex: 1, padding: 16 }}>
        <View className='flex flex-row items-center justify-start gap-2'>
          <Text className='text-lg font-semibold'>{transaction.title}</Text>
          <Text
            className='text-base'
            style={{
              color: transaction.type === 'Expense' ? 'red' : 'green',
            }}
          >
            {transaction.type}
          </Text>
        </View>
        <Text className='text-base mt-2'>{transaction.description}</Text>
        <Text className='text-xl font-semibold mt-4'>Category</Text>
        <Text className='text-base'>{transaction.category}</Text>
        <Text className='text-xl font-semibold mt-4'>Amount</Text>
        <Text className='text-base'>${transaction.amount}</Text>
        <Text className='text-xl font-semibold mt-4'>Splits</Text>
        {transaction.splits.map((split) => (
          <View
            key={split.userId}
            className='flex flex-row justify-between py-1'
          >
            <Text className='text-base'>User {split.userId}</Text>
            <Text>
              ${split.value} ({split.percent}%)
            </Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default TransactionDetails;
