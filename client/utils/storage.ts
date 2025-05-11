import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeUserData = async (user: any, token: string) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    await AsyncStorage.setItem('token', token);
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

export const getUserData = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    const token = await AsyncStorage.getItem('token');
    return {
      user: user ? JSON.parse(user) : null,
      token,
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    return { user: null, token: null };
  }
};

export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};
