import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { useIsFocused } from '@react-navigation/native';

import { useState, useEffect } from 'react';

import { db } from '../firebaseConfig';
import { addDoc, getDocs, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

import isUserInputValid from '../utils/validateUserInput.js';
import { createRentalStyles } from '../css/createRentalStyles.js';
import { useAuth } from '../store/AuthContext';
import LogoutButton from '../components/LogoutButton.js';

export default function CreateRental({ navigation }) {
  const isUserOnThisScreen = useIsFocused();

  const [noOfBeds, onChangeBeds] = React.useState('');
  const [noOfBathrooms, onChangeBathrooms] = React.useState('');
  const [noOfGuests, onChangeGuests] = React.useState('');
  const [description, onChangeDescription] = React.useState('');
  const [price, onChangePrice] = React.useState('');
  const { loggedInUserEmail } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

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
      headerRight: () => <LogoutButton />,
    });
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

      return { latitude: result.latitude, longitude: result.longitude };
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

    const geocodingResults = await forwardGeocodingSucceeded();
    if (geocodingResults !== false) {
      try {
        const listingsRef = collection(db, 'listings');
        await addDoc(listingsRef, {
          noOfBeds: parseInt(noOfBeds),
          noOfBathrooms: parseInt(noOfBathrooms),
          noOfGuests: parseInt(noOfGuests),
          description,
          pricePerNight: parseInt(price),
          status: 'CONFIRMED',
          houseImage: randomHomeImage,
          amenities,
          city,
          address,
          lat: geocodingResults.latitude,
          lng: geocodingResults.longitude,
          ownerEmail: loggedInUserEmail,
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
    <>
      <View
        style={[
          {
            backgroundColor: '#FAFAFA',
            flex: 1,
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 35, paddingBottom: 30 }}
        >
          {isLoading ? (
            <ActivityIndicator size='large' color='#0000ff' />
          ) : (
            <>
              {/* Location */}
              <View style={[{ marginTop: 10 }]}>
                <View style={[createRentalStyles.fullWidth]}>
                  <Text style={[createRentalStyles.sectionHeaderText]}>
                    Location
                  </Text>
                  <View
                    style={[createRentalStyles.sectionHeaderDivider]}
                  ></View>
                </View>
                <View style={[createRentalStyles.fullWidth]}>
                  <Text style={[createRentalStyles.inputHeaderText]}>
                    Address
                  </Text>
                  <TextInput
                    style={[createRentalStyles.textInput]}
                    placeholder='1750 Finch Avenue East'
                    onChangeText={onChangeAddress}
                    value={address}
                  />
                </View>

                <View style={[createRentalStyles.fullWidth, { marginTop: 10 }]}>
                  <Text style={[createRentalStyles.inputHeaderText]}>City</Text>
                  <TextInput
                    style={[createRentalStyles.textInput]}
                    placeholder='Toronto'
                    onChangeText={onChangeCity}
                    value={city}
                  />
                </View>
              </View>

              {/* Accomodation Details */}
              <View style={[{ marginTop: 25 }]}>
                <View style={[createRentalStyles.fullWidth]}>
                  <Text style={[createRentalStyles.sectionHeaderText]}>
                    Accomodation Details
                  </Text>
                  <View
                    style={[createRentalStyles.sectionHeaderDivider]}
                  ></View>
                </View>

                <View style={[createRentalStyles.fullWidth, { marginTop: 10 }]}>
                  <Text style={[createRentalStyles.inputHeaderText]}>
                    Amount of Beds
                  </Text>
                  <TextInput
                    style={[createRentalStyles.textInput]}
                    placeholder='3'
                    keyboardType='numeric'
                    onChangeText={onChangeBeds}
                    value={noOfBeds}
                  />
                </View>

                <View style={[createRentalStyles.fullWidth, { marginTop: 10 }]}>
                  <Text style={[createRentalStyles.inputHeaderText]}>
                    Amount of Bathrooms
                  </Text>
                  <TextInput
                    style={[createRentalStyles.textInput]}
                    placeholder='2'
                    keyboardType='numeric'
                    onChangeText={onChangeBathrooms}
                    value={noOfBathrooms}
                  />
                </View>

                <View style={[createRentalStyles.fullWidth, { marginTop: 10 }]}>
                  <Text style={[createRentalStyles.inputHeaderText]}>
                    Amount of Guests
                  </Text>
                  <TextInput
                    style={[createRentalStyles.textInput]}
                    placeholder='5'
                    keyboardType='numeric'
                    onChangeText={onChangeGuests}
                    value={noOfGuests}
                  />
                </View>

                <View style={[createRentalStyles.fullWidth, { marginTop: 10 }]}>
                  <Text style={[createRentalStyles.inputHeaderText]}>
                    Description
                  </Text>
                  <TextInput
                    style={[createRentalStyles.textInput, { height: 150 }]}
                    placeholder='Experience the best stay of your life! Our home is located in the heart of the city, close to all the major attractions.'
                    onChangeText={onChangeDescription}
                    value={description}
                    multiline={true}
                  />
                </View>

                <View style={[createRentalStyles.fullWidth, { marginTop: 10 }]}>
                  <Text style={[createRentalStyles.inputHeaderText]}>
                    Price per night
                  </Text>
                  <TextInput
                    style={[createRentalStyles.textInput]}
                    placeholder='$50'
                    keyboardType='numeric'
                    onChangeText={onChangePrice}
                    value={price}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={createRentalStyles.button}
                onPress={createRental}
              >
                <Text style={createRentalStyles.buttonText}>Create Rental</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </>
  );
}
