import { View, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { showModal } from '../redux/store/modalSlice';
import { clearUser } from '../redux/store/userSlice';
import { clearUserData } from '../utils/storage';

const BottomBar = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await clearUserData();
      dispatch(clearUser());
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View className='flex-row justify-between gap-2 items-center p-4 bg-white'>
      <Pressable onPress={() => dispatch(showModal('createTransaction'))}>
        <Ionicons name='add-circle-outline' size={24} color='blue' />
      </Pressable>
      <Pressable onPress={() => {}}>
        <Feather name='search' size={24} color='blue' />
      </Pressable>
      <Pressable onPress={handleLogout}>
        <Feather name='log-out' size={24} color='blue' />
      </Pressable>
    </View>
  );
};

export default BottomBar;
