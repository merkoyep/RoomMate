import { Modal, View, StyleSheet, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { resetStep } from '../../../redux/store/createTransactionSlice';
import CreateTransactionNavbar from './CreateTransactionNavbarContainer';
import CreateTransactionFormComponent from './CreateTransactionFormComponent';
import { clearTransactionForm } from '../../../redux/store/transactionFormSlice';
import { useSubmitTransaction } from './useSubmitTransaction';
import { triggerRefresh } from '../../../redux/store/transactionSlice';
import { useGetTransactions } from '../TransactionContainer/useGetTransactions';

const CreateTransactionModal = ({ onClose }: { onClose: () => void }) => {
  const step = useSelector((state: any) => state.createTransaction.step);
  const dispatch = useDispatch();
  const { submitTransaction } = useSubmitTransaction();
  const { refetch } = useGetTransactions();

  const handleClose = () => {
    dispatch(resetStep());
    dispatch(clearTransactionForm());
    onClose();
  };

  const handleSubmit = async () => {
    try {
      await submitTransaction();
      await refetch();
      dispatch(triggerRefresh());
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
          <ScrollView style={styles.scrollView}>
            <CreateTransactionFormComponent step={step} />
          </ScrollView>
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
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    maxHeight: '90%',
  },
  scrollView: {
    padding: 20,
  },
});

export default CreateTransactionModal;
