import React from 'react';
import { Text, TouchableOpacity, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { StackActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';

const LogoutButton = () => {
  const navigation = useNavigation();

  const logoutPressed = async () => {
    try {
      await signOut(auth);
      navigation.dispatch(StackActions.popToTop());
    } catch (error) {
      console.log(`error logging out: ${error}`);
      Alert.alert('Error logging out', `There was an error logging out: ${error}`);
    }
  };

  return (
    <TouchableOpacity
      onPress={logoutPressed}
      style={{
        backgroundColor: '#c0392b',
        borderRadius: 5,
        marginRight: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 0,
        padding: 5,
        marginLeft: 15,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#c0392b',
        padding: 7,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          color: '#c0392b',
        }}
      >
        Sign Out
      </Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;
