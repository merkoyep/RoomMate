import React, { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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
            <View className='px-4'>
              <Picker
                selectedValue={value}
                onValueChange={(itemValue) => {
                  onValueChange(itemValue);
                  setModalVisible(false);
                }}
                style={{ height: 200 }}
              >
                <Picker.Item label={placeholder} value='' />
                {items.map((item) => (
                  <Picker.Item key={item} label={item} value={item} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default FormPicker;
