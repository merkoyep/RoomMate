import { Pressable, View, Text } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useDispatch } from 'react-redux';
import {
  nextStep,
  prevStep,
} from '../../../redux/store/createTransactionSlice';
import Ionicons from '@expo/vector-icons/build/Ionicons';

const CreateTransactionNavbar = ({
  step,
  handleClose,
  handleSubmit,
}: {
  step: number;
  handleClose: () => void;
  handleSubmit: () => void;
}) => {
  const dispatch = useDispatch();
  const BLUE = '#3B82F6';

  return (
    <View className='flex-shrink-0 flex-row justify-between h-10'>
      {step === 0 && (
        <View className='flex-1 flex-row justify-between items-center h-10'>
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#c3d0db' : 'transparent',
              borderRadius: 9999,
            })}
          >
            <EvilIcons name='close' size={24} color={BLUE} />
          </Pressable>
          <Text className='text-xl font-bold'>Create Transaction Form</Text>
          <Pressable
            onPress={() => dispatch(nextStep())}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#c3d0db' : 'transparent',
              borderRadius: 9999,
              padding: 8,
            })}
          >
            <Text style={{ color: BLUE }}>Next</Text>
          </Pressable>
        </View>
      )}
      {step !== 2 && step !== 0 && (
        <View className='flex-1 flex-row justify-between items-center h-10'>
          <Pressable
            onPress={() => dispatch(prevStep())}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#c3d0db' : 'transparent',
              borderRadius: 9999,
            })}
          >
            <AntDesign name='back' size={24} color={BLUE} />
          </Pressable>
          <Text className='text-xl font-bold'>Create Transaction Form</Text>
          <Pressable
            onPress={() => dispatch(nextStep())}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#c3d0db' : 'transparent',
              borderRadius: 9999,
            })}
          >
            <Text style={{ color: BLUE }}>Next</Text>
          </Pressable>
        </View>
      )}
      {step === 2 && (
        <View className='flex-1 flex-row justify-between items-center h-10'>
          <Pressable
            onPress={() => dispatch(prevStep())}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#c3d0db' : 'transparent',
              borderRadius: 9999,
            })}
          >
            <AntDesign name='back' size={24} color={BLUE} />
          </Pressable>
          <Text className='text-xl font-bold pt-4'>New Transaction</Text>
          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#c3d0db' : 'transparent',
              borderRadius: 9999,
            })}
          >
            <EvilIcons name='check' size={24} color={BLUE} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default CreateTransactionNavbar;
