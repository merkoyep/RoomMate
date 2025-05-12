import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Pressable,
  Modal,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setField, setSplit } from '../../../redux/store/transactionFormSlice';
import Animated, {
  SlideInRight,
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import { useRef, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES, GET_USERS } from '../../../graphql/queries';
import FormPicker from './Picker';
import { Calendar } from 'react-native-calendars';

interface User {
  id: string;
  username: string;
}

export interface Split {
  userId: string;
  percent: string;
  value: string;
}

export type Transaction = {
  id: string;
  title: string;
  type: string;
  description: string;
  category: string;
  amount: string;
  splits: Split[];
  paidBy: User;
  transactionDate: string;
  createdAt: string;
};

const CreateTransactionFormComponent = ({ step }: { step: number }) => {
  const dispatch = useDispatch();
  const transactionForm = useSelector((state: any) => state.transactionForm);
  const { data, loading, error } = useQuery(GET_USERS);
  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError,
  } = useQuery(GET_CATEGORIES);
  const prevStepRef = useRef(step);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  enum typeOptions {
    Expense = 'Expense',
    Payment = 'Payment',
  }

  useEffect(() => {
    prevStepRef.current = step;
  }, [step]);

  useEffect(() => {
    if (transactionForm.type === 'Payment') {
      dispatch(setField({ field: 'category', value: 'Payment' }));
    }
  }, [transactionForm.type]);

  useEffect(() => {
    const amount = parseFloat(transactionForm.amount) || 0;
    Object.entries(transactionForm.splits).forEach(
      ([userId, split]: [string, any]) => {
        const percentNum = Number(split.percent) || 0;
        const value = amount ? ((percentNum / 100) * amount).toFixed(2) : '';
        dispatch(setSplit({ userId, split: { ...split, value } }));
      }
    );
  }, [transactionForm.amount]);

  const handlePercentChange = (userId: string, percent: string) => {
    const amount = parseFloat(transactionForm.amount) || 0;
    const percentNum = Number(percent) || 0;
    const value = amount ? ((percentNum / 100) * amount).toFixed(2) : '';
    dispatch(setSplit({ userId, split: { percent, value } }));
  };

  const handleValueChange = (userId: string, value: string) => {
    const amount = parseFloat(transactionForm.amount) || 0;
    const valueNum = Number(value) || 0;
    const percent = amount ? ((valueNum / amount) * 100).toFixed(2) : '';
    dispatch(setSplit({ userId, split: { percent, value } }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      dispatch(
        setField({
          field: 'transactionDate',
          value: selectedDate.toISOString(),
        })
      );
    }
  };

  const handleDateSelect = (date: any) => {
    const selectedDate = new Date(date.timestamp);
    selectedDate.setHours(12, 0, 0, 0);
    dispatch(
      setField({
        field: 'transactionDate',
        value: selectedDate.toISOString(),
      })
    );
    setShowCalendar(false);
  };

  const isForward = step > prevStepRef.current;

  if (loading) return <Text>Loading users...</Text>;
  if (error) return <Text>Error loading users: {error.message}</Text>;

  const users = data?.getUsers || [];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className='flex-1 flex flex-col py-4'>
        {step === 0 && (
          <Animated.View
            entering={
              isForward ? SlideInRight.duration(300) : SlideInLeft.duration(300)
            }
            exiting={
              isForward
                ? SlideOutRight.duration(300)
                : SlideOutLeft.duration(100)
            }
            className='flex gap-4'
          >
            <View className='flex flex-col'>
              <Text className='text-sm text-gray-500'>Title</Text>
              <TextInput
                className='border-2 border-gray-300 rounded-lg p-2'
                placeholder='Title'
                value={transactionForm.title}
                keyboardType='default'
                onChangeText={(text: string) =>
                  dispatch(setField({ field: 'title', value: text }))
                }
              />
            </View>
            <View className='flex flex-col'>
              <Text className='text-sm text-gray-500'>Type</Text>
              <FormPicker
                value={transactionForm.type}
                onValueChange={(value) => {
                  dispatch(setField({ field: 'type', value }));
                }}
                items={Object.values(typeOptions)}
                placeholder='Select a type'
              />
            </View>
            <View className='flex flex-col'>
              <Text className='text-sm text-gray-500'>Description</Text>
              <TextInput
                className='border-2 border-gray-300 rounded-lg p-2'
                placeholder='Description'
                value={transactionForm.description}
                onChangeText={(text: string) =>
                  dispatch(setField({ field: 'description', value: text }))
                }
                multiline={true}
                keyboardType='default'
                textAlignVertical='top'
              />
            </View>
            {transactionForm.type !== 'Payment' && (
              <View className='flex flex-col'>
                <Text className='text-sm text-gray-500'>Category</Text>
                <FormPicker
                  value={transactionForm.category}
                  onValueChange={(value) =>
                    dispatch(setField({ field: 'category', value }))
                  }
                  items={categoryData?.getCategories?.map(
                    (category: any) => category.name
                  )}
                  placeholder='Select a category'
                />
              </View>
            )}
          </Animated.View>
        )}
        {step === 1 && (
          <Animated.View
            entering={
              isForward ? SlideInRight.duration(300) : SlideInLeft.duration(300)
            }
            exiting={
              isForward
                ? SlideOutLeft.duration(300)
                : SlideOutRight.duration(100)
            }
            className='flex flex-col gap-2'
          >
            <View className='flex flex-col'>
              <Text className='text-sm text-gray-500'>Paid By</Text>
              <FormPicker
                value={
                  users.find(
                    (u: any) =>
                      u._id === transactionForm.paidBy ||
                      u.id === transactionForm.paidBy
                  )?.username || ''
                }
                onValueChange={(username: string) => {
                  const user = users.find((u: any) => u.username === username);
                  dispatch(
                    setField({
                      field: 'paidBy',
                      value: user?._id || user?.id || '',
                    })
                  );
                }}
                items={users.map((user: any) => user.username)}
                placeholder='Select a user'
              />
            </View>
            <View className='flex flex-col'>
              <Text className='text-sm text-gray-500'>Transaction Date</Text>
              <Pressable
                onPress={() => setShowCalendar(true)}
                className='border-2 border-gray-300 rounded-lg p-2'
              >
                <Text>
                  {transactionForm.transactionDate
                    ? new Date(
                        transactionForm.transactionDate
                      ).toLocaleDateString()
                    : 'Select a date'}
                </Text>
              </Pressable>
            </View>
            <View className='flex flex-col'>
              <Text className='text-sm text-gray-500'>Amount</Text>
              <View className='flex flex-row items-center p-2 border-2 border-gray-300 rounded-lg'>
                <Text className='text-base mr-1 pr-2'>$</Text>
                <TextInput
                  placeholder='0.00'
                  value={transactionForm.amount}
                  keyboardType='decimal-pad'
                  onChangeText={(text: string) => {
                    if (text === '' || /^\d*\.?\d*$/.test(text)) {
                      dispatch(setField({ field: 'amount', value: text }));
                    }
                  }}
                />
              </View>
            </View>
            {transactionForm.type === 'expense' && (
              <View className='flex flex-col'>
                <Text className='text-sm text-gray-500'>Split</Text>
                <View className='flex flex-col gap-1'>
                  {users.map((user: any) => (
                    <View
                      key={user._id || user.id}
                      className='flex flex-row items-center justify-between p-2 border-2 border-gray-300 rounded-lg'
                    >
                      <Text className='text-base'>{user.username}</Text>
                      <View className='flex flex-row items-center gap-4'>
                        <View className='flex flex-row items-center'>
                          <TextInput
                            placeholder='0'
                            value={transactionForm.splits[
                              String(user._id || user.id)
                            ]?.percent?.toString()}
                            keyboardType='numeric'
                            onChangeText={(text) =>
                              handlePercentChange(
                                String(user._id || user.id),
                                text
                              )
                            }
                            className='border-2 border-gray-200 text-right rounded-lg p-1 w-16 mx-2'
                          />
                          <Text className='text-base'>%</Text>
                        </View>

                        <View className='flex flex-row items-center'>
                          <Text className='text-base'>$</Text>
                          <TextInput
                            placeholder='0.00'
                            value={transactionForm.splits[
                              String(user._id || user.id)
                            ]?.value?.toString()}
                            keyboardType='numeric'
                            onChangeText={(text) =>
                              handleValueChange(
                                String(user._id || user.id),
                                text
                              )
                            }
                            className='border-2 border-gray-200 text-right rounded-lg p-1 w-24 mx-2'
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </Animated.View>
        )}
        {step === 2 && (
          <Animated.View
            entering={SlideInRight.duration(300)}
            exiting={SlideOutLeft.duration(300)}
            className='flex flex-col gap-2'
          >
            <View className='flex flex-col justify-start border-b-2 border-gray-300 pb-2'>
              <View className='flex flex-row items-center'>
                <Text className='text-lg font-semibold pr-2'>
                  {transactionForm.title}
                </Text>
                <Text
                  className='text-base'
                  style={{
                    color: transactionForm.type === 'expense' ? 'red' : 'green',
                  }}
                >
                  {transactionForm.type.charAt(0).toUpperCase() +
                    transactionForm.type.slice(1)}
                </Text>
              </View>
              <Text className='text-base'>{transactionForm.description}</Text>
            </View>
            <View className='flex flex-row items-center justify-between'>
              <Text className='text-sm text-gray-500'>Paid By</Text>
              <Text className='text-base'>
                {
                  users.find((u: any) => u.id === transactionForm.paidBy)
                    ?.username
                }
              </Text>
            </View>
            {transactionForm.type !== 'Payment' && (
              <View className='flex flex-col'>
                <View className='flex flex-row items-center justify-between mb-2'>
                  <Text className='text-sm text-gray-500'>Category</Text>
                  <Text className='text-base'>{transactionForm.category}</Text>
                </View>
                <View className='flex flex-col'>
                  <Text className='text-sm text-gray-500 mb-2'>Splits</Text>
                  {Object.entries(transactionForm.splits).map(
                    ([userId, split]) => {
                      const splitObj = split as Split;
                      return (
                        <View
                          key={userId}
                          className='flex flex-row justify-between py-1'
                        >
                          <Text className='text-base'>
                            {users.find((u: any) => u.id === userId)?.username}
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
                    }
                  )}
                </View>
              </View>
            )}
            <View className='flex flex-row items-center justify-between'>
              <Text className='text-sm text-gray-500'>Total Amount</Text>
              <Text className='text-base'>
                ${Number(transactionForm.amount).toFixed(2)}
              </Text>
            </View>
          </Animated.View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateTransactionFormComponent;
