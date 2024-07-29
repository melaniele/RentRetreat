import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import * as Location from 'expo-location';
import { useIsFocused, StackActions } from '@react-navigation/native';

import { useState, useEffect } from 'react';

import { db } from '../firebaseConfig';
import { addDoc, getDocs, collection } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

import isUserInputValid from '../utils/validateUserInput.js';
import { createRentalStyles } from '../css/createRentalStyles.js';
import { loginStyles } from '../css/loginStyles.js';

export default function CreateRental({ navigation, route }) {
  const isUserOnThisScreen = useIsFocused();

  const [noOfBeds, onChangeBeds] = React.useState('');
  const [noOfBathrooms, onChangeBathrooms] = React.useState('');
  const [noOfGuests, onChangeGuests] = React.useState('');
  const [description, onChangeDescription] = React.useState('');
  const [price, onChangePrice] = React.useState('');
  const { email } = route.params;

  const [isLoading, setIsLoading] = useState(false);

  const [latitude, setLatitude] = useState('-33.8568');
  const [longitude, setLongitude] = useState('151.2153');

  const [city, onChangeCity] = React.useState('Toronto');
  const [address, onChangeAddress] = React.useState('1750 Finch Avenue East');

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  useEffect(() => {
    setHeader();
  }, [isUserOnThisScreen]);

  useEffect(() => {
    const listener = onAuthStateChanged(auth, (userFromFirebaseAuth) => {
      if (userFromFirebaseAuth) {
        console.log(`user is logged in: ${userFromFirebaseAuth.email}`);
      } else {
        console.log(`user is logged out`);
      }
    });
    return listener;
  }, []);

  const setHeader = () => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            logoutPressed();
          }}
          style={{
            ...loginStyles.header,
            marginLeft: 15,
            backgroundColor: '#fa8231',
            padding: 7
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: 'black'
            }}
          >
            Sign Out
          </Text>
        </TouchableOpacity>
      )
    });
  };

  const logoutPressed = async () => {
    try {
      await signOut(auth);
      navigation.dispatch(StackActions.popToTop());
      console.log('user has been logged out');
    } catch (error) {
      console.log(`error logging out: ${error}`);
      Alert.alert(
        'Error logging out',
        `There was an error logging out: ${error}`
      );
    }
  };

  const requestLocationPermissions = async () => {
    try {
      const permissionsObject =
        await Location.requestForegroundPermissionsAsync();
      if (permissionsObject.status !== 'granted') {
        //if user denies permission,
        //then the location api for Android might not work
      }
    } catch (err) {
      console.log(err);
    }
  };

  const forwardGeocodingSucceeded = async () => {
    try {
      // array of possible locations
      const geocodedLocation = await Location.geocodeAsync(
        address + ' ' + city
      );

      //first location is the most accurate
      const result = geocodedLocation[0];
      if (result === undefined) {
        return false;
      }

      setLatitude(result.latitude);
      setLongitude(result.longitude);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const createRental = async () => {
    if (
      isUserInputValid(
        noOfBeds,
        noOfBathrooms,
        noOfGuests,
        description,
        price,
        city,
        address
      ) === false
    ) {
      return;
    }

    setIsLoading(true);
    let homes = {};
    let randomHomeImage = '';
    let amenities = [];

    try {
      const countriesRef = collection(db, 'homes');
      const querySnapshot = await getDocs(countriesRef);
      querySnapshot.forEach((doc) => {
        homes = doc.data();
      });

      //get random image string
      randomHomeImage =
        homes.photos[Math.floor(Math.random() * homes.photos.length)];

      //get any 2 random non-repeating amenities
      while (amenities.length < 2) {
        const randomAmenity =
          homes.amenities[Math.floor(Math.random() * homes.amenities.length)];
        if (!amenities.includes(randomAmenity)) {
          amenities.push(randomAmenity);
        }
      }
    } catch (error) {
      console.error('Error getting documents from homes: ', error);
    }

    if (forwardGeocodingSucceeded()) {
      try {
        const listingsRef = collection(db, 'listings');
        await addDoc(listingsRef, {
          noOfBeds: parseInt(noOfBeds),
          noOfBathrooms: parseInt(noOfBathrooms),
          noOfGuests: parseInt(noOfGuests),
          description,
          pricePerNight: parseInt(price),
          status: 'confirmed',
          houseImage: randomHomeImage,
          amenities,
          city,
          address,
          latitude: latitude,
          longitude: longitude,
          ownerEmail: email
        });
        alert('Rental created!');
      } catch (error) {
        console.error('Error creating a rental: ', error);
        alert('Error creating a rental!');
      }
    } else {
      alert('Address not found');
    }
    setIsLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={createRentalStyles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
        />
      ) : (
        <>
          <View style={createRentalStyles.inputContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={createRentalStyles.text}>Address </Text>
              <Text style={{ ...createRentalStyles.text, color: 'red' }}>
                *
              </Text>
            </View>
            <TextInput
              style={{
                ...createRentalStyles.input,
                width: 200,
                padding: 10
              }}
              placeholder="1750 Finch Avenue East"
              onChangeText={onChangeAddress}
              value={address}
            />
          </View>
          <View style={createRentalStyles.inputContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={createRentalStyles.text}>City </Text>
              <Text style={{ ...createRentalStyles.text, color: 'red' }}>
                *
              </Text>
            </View>
            <TextInput
              style={{
                ...createRentalStyles.input,
                width: 200,
                padding: 10
              }}
              placeholder="Toronto"
              onChangeText={onChangeCity}
              value={city}
            />
          </View>
          <View style={createRentalStyles.inputContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={createRentalStyles.text}>No of Beds </Text>
              <Text style={{ ...createRentalStyles.text, color: 'red' }}>
                *
              </Text>
            </View>
            <TextInput
              style={createRentalStyles.input}
              placeholder="3"
              keyboardType="numeric"
              onChangeText={onChangeBeds}
              value={noOfBeds}
            />
          </View>
          <View style={createRentalStyles.inputContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={createRentalStyles.text}>No of Bathrooms </Text>
              <Text style={{ ...createRentalStyles.text, color: 'red' }}>
                *
              </Text>
            </View>
            <TextInput
              style={createRentalStyles.input}
              placeholder="2"
              keyboardType="numeric"
              onChangeText={onChangeBathrooms}
              value={noOfBathrooms}
            />
          </View>
          <View style={createRentalStyles.inputContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={createRentalStyles.text}>No of Guests </Text>
              <Text style={{ ...createRentalStyles.text, color: 'red' }}>
                *
              </Text>
            </View>
            <TextInput
              style={createRentalStyles.input}
              placeholder="5"
              keyboardType="numeric"
              onChangeText={onChangeGuests}
              value={noOfGuests}
            />
          </View>
          <View style={createRentalStyles.inputContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={createRentalStyles.text}>Description </Text>
              <Text style={{ ...createRentalStyles.text, color: 'red' }}>
                *
              </Text>
            </View>
            <TextInput
              style={{
                ...createRentalStyles.input,
                width: 200,
                height: 200,
                padding: 10
              }}
              placeholder="Experience the best stay of your life! Our home is located in the heart of the city, close to all the major attractions."
              onChangeText={onChangeDescription}
              value={description}
              multiline={true}
            />
          </View>
          <View style={createRentalStyles.inputContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={createRentalStyles.text}>Price per Night </Text>
              <Text style={{ ...createRentalStyles.text, color: 'red' }}>
                *
              </Text>
            </View>
            <TextInput
              style={createRentalStyles.input}
              placeholder="$50"
              keyboardType="numeric"
              onChangeText={onChangePrice}
              value={price}
            />
          </View>
          <TouchableOpacity
            style={createRentalStyles.pressable}
            onPress={createRental}
          >
            <Text style={createRentalStyles.createRentalText}>
              Create Rental
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}
