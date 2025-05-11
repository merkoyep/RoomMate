import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';

const UserSection = () => {
  const currentUser = useSelector((state: any) => state.user.currentUser);

  return (
    <View className='flex-row justify-between items-center p-4 w-full h-24 border-2 border-orange-500'>
      <View className='flex-col items-start gap-1'>
        <Text className='text-2xl'>
          {currentUser?.username || 'Loading...'}
        </Text>
        <Text className='text-sm text-gray-800'>Balance: $1000</Text>
      </View>
    </View>
  );
};

export default UserSection;
