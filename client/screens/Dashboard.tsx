import { View, SafeAreaView, Text } from 'react-native';
import TransactionContainer from '../components/Transactions/TransactionContainer/TransactionContainer';
import UserSection from '../components/UserSection/UserSection';
import BottomBar from '../components/BottomBar';
import { useSelector, useDispatch } from 'react-redux';
import CreateTransactionModal from '../components/Transactions/CreateTransaction/CreateTransactionModal';
import { hideModal } from '../redux/store/modalSlice';
import { useGetTransactions } from '../components/Transactions/TransactionContainer/useGetTransactions';
import { setTransactions } from '../redux/store/transactionSlice';
import { useEffect } from 'react';

const Dashboard = () => {
  const modalType = useSelector((state: any) => state.modal.modalType);
  const dispatch = useDispatch();
  const { data, loading, error, refetch } = useGetTransactions();

  // Load transactions into Redux state
  useEffect(() => {
    if (data?.getTransactions) {
      dispatch(setTransactions(data.getTransactions));
    }
  }, [data, dispatch]);

  const handleCloseModal = () => {
    dispatch(hideModal());
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text>Error loading transactions: {error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

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
