import { View, SafeAreaView } from 'react-native';
import TransactionContainer from '../components/Transactions/TransactionContainer/TransactionContainer';
import UserSection from '../components/UserSection/UserSection';
import BottomBar from '../components/BottomBar';
import { useSelector, useDispatch } from 'react-redux';
import CreateTransactionModal from '../components/Transactions/CreateTransaction/CreateTransactionModal';
import { hideModal } from '../redux/store/modalSlice';

const Dashboard = () => {
  const modalType = useSelector((state: any) => state.modal.modalType);
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    dispatch(hideModal());
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <UserSection />
        <TransactionContainer />
      </View>
      {modalType === 'createTransaction' && (
        <CreateTransactionModal onClose={handleCloseModal} />
      )}
      <BottomBar />
    </SafeAreaView>
  );
};

export default Dashboard;
