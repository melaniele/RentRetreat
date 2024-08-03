import { useEffect, useRef, useState } from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../components/AuthContext';

import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

import { useIsFocused } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { discoverStyles } from '../css/discoverStyles';
import { db } from '../firebaseConfig';
import LogoutButton from '../components/LogoutButton';
export default function Discover({ navigation, route }) {
  const { loggedInUserEmail, setUserCityLocation} = useAuth();
  const mapRef = useRef(null);
  const isUserOnThisScreen = useIsFocused();
  const [userLocation, setUserLocation] = useState(null);
  const [userCity, setUserCity] = useState(null);
  const [cityListings, setCityListings] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  const setHeader = () => {
    navigation.setOptions({
      headerRight: () => (
        <LogoutButton />
      )
    });
  };

  // On load:
  // 1 - Ask for location permission > fetch user current location
  useEffect(() => {
    setHeader();
    requestLocationPermissions();
    getCurrentLocation();
  }, [useIsFocused]);

  // 2 - Fetch user's city (convert coords to city)
  useEffect(() => {
    if (userLocation !== null) {
      getUserCity();
    }
  }, [userLocation]);

  // 3 - Fetch listing within the same city > show on maps
  useEffect(() => {
    if (userCity !== null) {
      getListingsInCity();
    }
  }, [userCity]);

  // Request for user's current permission > get location as soon as granted
  const requestLocationPermissions = async () => {
    try {
      const permissionObj = await Location.requestForegroundPermissionsAsync();
      if (permissionObj.status == 'granted') {
        console.log("User's location permission granted!");
      } else {
        console.log("User's location permission denied");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Get user's coordinates
  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (location != undefined) {
        setUserLocation(location);
        // show user's location on map
        const mapRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 1,
          longitudeDelta: 1,
        };

        if (mapRef !== null) {
          mapRef.current.animateToRegion(mapRegion, 1000);
        } else {
          console.error("MapView is null, can't show location on map");
        }
      } else {
        console.error('No location found');
        alert('Sorry, no location found.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Do reverse geocode
  const getUserCity = async () => {
    try {
      const coords = {
        latitude: parseFloat(userLocation.coords.latitude),
        longitude: parseFloat(userLocation.coords.longitude),
      };
      const address = await Location.reverseGeocodeAsync(coords);
      const result = address[0];
      if (result === undefined) {
        alert('No location found');
      } else {
        setUserCity(result.city);
        setUserCityLocation(result.city);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // fetch listing from db
  const getListingsInCity = async () => {
    try {
      const listingQuery = query(
        collection(db, 'listings'),
        where('city', '==', userCity),
        where('status', '==', 'CONFIRMED')
      );

      const resultFromDB = [];
      const querySnapshot = await getDocs(listingQuery);
      querySnapshot.forEach((currDoc) => {
        const listing = {
          id: currDoc.id,
          ...currDoc.data(),
        };
        resultFromDB.push(listing);
      });

      setCityListings(resultFromDB);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkerPress = (listing) => {
    setSelectedListing(listing);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={discoverStyles.container}>
      <MapView style={discoverStyles.map} ref={mapRef}>
        {userLocation && <Marker coordinate={userLocation?.coords} />}

        {cityListings.map((listing) => {
          const latitude = parseFloat(listing.lat);
          const longitude = parseFloat(listing.lng);

          if (isNaN(latitude) || isNaN(longitude)) {
            console.error(
              `Invalid coordinates for listing ${listing.id}:`,
              listing.lat,
              listing.lng
            );
            return null;
          }

          return (
            <Marker
              key={listing.id}
              coordinate={{
                latitude: latitude,
                longitude: longitude,
              }}
              onPress={() => handleMarkerPress(listing)}
            >
              <View style={discoverStyles.priceMarker}>
                <Text style={discoverStyles.priceMarkerText}>
                  ${listing.pricePerNight} CAD
                </Text>
              </View>
            </Marker>
          );
        })}
      </MapView>
      {selectedListing && (
        <Modal animationType='slide' transparent={true} visible={modalVisible}>
          <View style={discoverStyles.modalView}>
            <Ionicons
              name='close-circle'
              size={24}
              color='grey'
              style={discoverStyles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            />
            <Image
              source={{ uri: selectedListing.houseImage }}
              style={discoverStyles.modalImage}
            />
            <Text style={discoverStyles.modalAddress}>
              {`${selectedListing.address}, ${selectedListing.city}`}
            </Text>
            <Text style={discoverStyles.description}>
              {selectedListing.description}
            </Text>
            <Text style={discoverStyles.modalPrice}>
              ${selectedListing.pricePerNight} CAD night
            </Text>
            <Text style={discoverStyles.modalText}>
              {`${selectedListing.noOfBeds} bed${
                selectedListing.noOfBeds > 1 ? 's' : ''
              }, ${selectedListing.noOfBathrooms} bath${
                selectedListing.noOfBathrooms > 1 ? 's' : ''
              }`}
            </Text>
            <TouchableOpacity
              style={discoverStyles.button}
              onPress={() => {
                setModalVisible(!modalVisible);
                navigation.navigate('Confirm Reservation', {
                  listingID: selectedListing.id,
                  renterEmail: route.params.email,
                });
              }}
            >
              <Text style={discoverStyles.buttonText}>Confirm Reservation</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}
