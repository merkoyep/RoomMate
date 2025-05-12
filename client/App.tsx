import React from 'react';
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
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TransactionDetails from './screens/TransactionDetails';
import { Transaction } from './components/Transactions/CreateTransaction/CreateTransactionFormComponent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface Split {
  userId: string;
  percent: number;
  value: number;
}

interface TransactionWithSplits extends Omit<Transaction, 'splits'> {
  splits: Split[];
}

type RootStackParamList = {
  Dashboard: undefined;
  Login: undefined;
  TransactionDetails: { transaction: TransactionWithSplits };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
    <NavigationContainer>
      <Stack.Navigator>
        {currentUser ? (
          <>
            <Stack.Screen
              name='Dashboard'
              component={Dashboard}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='TransactionDetails'
              component={TransactionDetails}
              options={{ title: 'Transaction Details' }}
            />
          </>
        ) : (
          <Stack.Screen
            name='Login'
            component={Login}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <AppContent />
        </ApolloProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

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

export default App;
