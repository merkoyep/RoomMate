import { Modal, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { resetStep } from '../../../redux/store/createTransactionSlice';
import CreateTransactionNavbar from './CreateTransactionNavbarContainer';
import CreateTransactionFormComponent from './CreateTransactionFormComponent';
import { clearTransactionForm } from '../../../redux/store/transactionFormSlice';
import { useSubmitTransaction } from './useSubmitTransaction';

const CreateTransactionModal = ({ onClose }: { onClose: () => void }) => {
  const step = useSelector((state: any) => state.createTransaction.step);
  const dispatch = useDispatch();
  const { submitTransaction } = useSubmitTransaction();

  const handleClose = () => {
    dispatch(resetStep());
    dispatch(clearTransactionForm());
    onClose();
  };

  const handleSubmit = async () => {
    try {
      await submitTransaction();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal visible={true} transparent={true} onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <CreateTransactionNavbar
            step={step}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
          />
          <CreateTransactionFormComponent step={step} />
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
    height: '75%',
  },
});

export default CreateTransactionModal;
