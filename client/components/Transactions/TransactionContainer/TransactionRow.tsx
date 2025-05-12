import React, { useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import type {
  Transaction,
  Split,
} from '../CreateTransaction/CreateTransactionFormComponent';
import { useSelector, useDispatch } from 'react-redux';
import { useNetValue } from './useNetValue';
import { showModal } from '../../../redux/store/modalSlice';
import { useDeleteTransaction } from './useDeleteTransaction';
import { Ionicons } from '@expo/vector-icons';

interface TransactionWithSplits extends Omit<Transaction, 'splits'> {
  splits: { [key: string]: Split };
}

const TransactionRow = ({ transaction }: { transaction: Transaction }) => {
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const netValue = useNetValue({ transaction });
  const dispatch = useDispatch();
  const { deleteTransaction, loading, error } = useDeleteTransaction();
  const swipeableRef = useRef<Swipeable>(null);

  const onPress = () => {
    dispatch(
      showModal({ type: 'readTransaction', selectedTransaction: transaction })
    );
  };

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction.id);
      swipeableRef.current?.close();
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
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

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View className='flex-row items-center justify-end bg-red-500 h-20 rounded-r-lg'>
        <Animated.View
          style={[
            {
              transform: [{ scale }],
            },
          ]}
          className='flex-row items-center justify-center px-4'
        >
          <Pressable
            onPress={handleDelete}
            className='flex-row items-center justify-center'
          >
            <Ionicons name='trash-outline' size={24} color='white' />
            <Text className='text-white ml-2'>Delete</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
    >
      <Pressable
        className='w-full h-20 border-b-2 border-gray-200 px-4 py-3 mb-2 rounded-lg pressed:bg-gray-100 bg-white'
        onPress={onPress}
      >
        <View className='flex-row justify-between items-center h-full'>
          <View className='flex-col items-start gap-1'>
            <View className='flex-row items-center justify-start'>
              <Text className='text-base font-semibold'>
                {transaction.title}
              </Text>
            </View>
            <View className='flex-row justify-start items-center'>
              <Text
                className='text-white text-sm'
                style={{
                  color: transaction.type === 'Expense' ? 'red' : 'green',
                }}
              >
                {transaction.type}
              </Text>
              <Text className='text-sm text-gray-600'> | </Text>
              <Text className='text-sm font-semibold text-gray-600'>
                {transaction.paidBy.username}
              </Text>
            </View>
            <View className='flex-row items-center justify-start pb-3'>
              <Text className='text-sm text-gray-600'>
                {formatDate(transaction.createdAt)}
              </Text>
            </View>
          </View>
          <View className='flex-col items-end'>
            <Text className='text-base font-semibold'>
              ${Number(transaction.amount).toFixed(2)}
            </Text>
            {transaction.type === 'Expense' && (
              <Text
                className='text-sm'
                style={{
                  color: netValue < 0 ? 'red' : 'green',
                }}
              >
                {netValue < 0
                  ? `-$${Math.abs(netValue).toFixed(2)}`
                  : `+ $${netValue.toFixed(2)}`}
              </Text>
            )}
            {transaction.type === 'Payment' &&
              netValue.toString().substring(0, 1) === '-' && (
                <Text className='text-sm text-red-500'>
                  - ${Math.abs(netValue).toFixed(2)}
                </Text>
              )}
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
};

export default TransactionRow;
