import { Modal, View, StyleSheet, Pressable, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ReadTransactionContainer } from './ReadTransactionContainer';
import { hideModal } from '../../../redux/store/modalSlice';
import { Ionicons } from '@expo/vector-icons';

const ReadTransactionModal = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useDispatch();
  const selectedTransaction = useSelector(
    (state: any) => state.modal.selectedTransaction
  );

  const handleClose = () => {
    dispatch(hideModal());
    onClose();
  };

  return (
    <Modal visible={true} transparent={true} onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View className='flex-shrink-0 flex-row justify-between h-10 mb-4'>
            <View className='flex-1 flex-row justify-between items-center'>
              <Pressable
                onPress={handleClose}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? '#c3d0db' : 'transparent',
                  borderRadius: 9999,
                })}
              >
                <Ionicons name='close' size={24} color='#3B82F6' />
              </Pressable>
              <Text className='text-xl font-bold'>Transaction Details</Text>
              <View style={{ width: 24 }} />
            </View>
          </View>
          <ReadTransactionContainer
            transaction={selectedTransaction}
            onClose={handleClose}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
  },
});

export default ReadTransactionModal;
