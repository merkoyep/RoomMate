import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import { Provider } from 'react-redux';
import store from './redux/store';
import { StyleSheet } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setToken } from './redux/store/userSlice';
import { getUserData } from './utils/storage';

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.user.currentUser);

  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const { user, token } = await getUserData();
        if (user && token) {
          dispatch(setUser(user));
          dispatch(setToken(token));
        }
      } catch (error) {
        console.error('Error loading stored user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredUser();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style='auto' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      {currentUser ? <Dashboard /> : <Login />}
    </View>
  );
};

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
