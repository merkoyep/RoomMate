import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import useCalculateWallet from '../../utils/useCalculateWallet';

const UserSection = () => {
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const { calculateWallet } = useCalculateWallet();
  const wallet = calculateWallet();

  return (
    <View className='flex-row justify-between items-center px-4 w-full h-20'>
      <View className='flex-col items-start gap-1'>
        <Text className='text-2xl'>
          {currentUser?.username || 'Loading...'}
        </Text>
        {wallet > 0 ? (
          <Text className='text-sm text-gray-800'>
            Balance: ${wallet.toFixed(2)}
          </Text>
        ) : (
          <View className='flex-row items-center'>
            <Text className='text-sm text-gray-800'>Balance: </Text>
            <Text className='text-sm text-red-500'>
              - ${(wallet * -1).toFixed(2)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default UserSection;
