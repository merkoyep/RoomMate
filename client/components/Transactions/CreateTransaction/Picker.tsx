import React, { useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FormPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  items?: string[];
  placeholder: string;
}

const FormPicker = ({
  value,
  onValueChange,
  items = [],
  placeholder,
}: FormPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        className='flex flex-row items-center justify-between p-2 border-2 border-gray-300 rounded-lg'
      >
        <Text className='text-base'>{value ? value : placeholder}</Text>
        <Ionicons name='chevron-down' size={20} color='#6B7280' />
      </Pressable>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setModalVisible(false)}
      >
        <View className='flex-1 justify-end bg-black/50'>
          <View className='bg-white rounded-t-xl pb-8'>
            <View className='flex flex-row justify-between items-center p-4 border-b border-gray-200'>
              <Text className='text-lg font-semibold'>Select an option</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name='close' size={24} color='#6B7280' />
              </Pressable>
            </View>
            <ScrollView className='max-h-[300px]'>
              <Pressable
                onPress={() => {
                  onValueChange('');
                  setModalVisible(false);
                }}
                className='p-4 border-b border-gray-200'
              >
                <Text className='text-base'>{placeholder}</Text>
              </Pressable>
              {items.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => {
                    onValueChange(item);
                    setModalVisible(false);
                  }}
                  className='p-4 border-b border-gray-200'
                >
                  <Text className='text-base'>{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default FormPicker;
