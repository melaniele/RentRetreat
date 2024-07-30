import { useEffect, useRef, useState } from "react";
import { Button, SafeAreaView, Text, View } from "react-native";
import { useAuth } from "../components/AuthContext";

import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

import { collection, getDocs, query, where } from "firebase/firestore";
import { discoverStyles } from "../css/discoverStyles";
import { db } from "../firebaseConfig";

export default function Discover({ navigation, route }) {
  const { loggedInUserEmail } = useAuth();
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userCity, setUserCity] = useState(null);
  const [cityListings, setCityListings] = useState([]);

  // On load:
  // 1 - Ask for location permission > fetch user current location
  useEffect(() => {
    requestLocationPermissions();
    getCurrentLocation();
  }, []);

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
      if (permissionObj.status == "granted") {
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
        console.error("No location found");
        //TODO: set warning/error here
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
        alert("No location found");
      } else {
        setUserCity(result.city);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // fetch listing from db
  const getListingsInCity = async () => {
    try {
      const listingQuery = query(
        collection(db, "listings"),
        where("city", "==", userCity),
        where("status", "==", "CONFIRMED")
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

      console.log(resultFromDB.length);
      setCityListings(resultFromDB);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkerPress = (listing) => {
    console.log({ listing });
  };

  return (
    <SafeAreaView style={discoverStyles.container}>
      <MapView style={discoverStyles.map} ref={mapRef}>
        {userLocation && <Marker coordinate={userLocation?.coords} />}

        {cityListings.map((listing) => {
          const latitude = parseFloat(listing.lat);
          const longitude = parseFloat(listing.lng);

          if (isNaN(latitude) || isNaN(longitude)) {
            console.error(`Invalid coordinates for listing ${listing.id}:`, listing.lat, listing.lng);
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
                  ${listing.pricePerNight}
                </Text>
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/*Temporary - Added so that we can navigate and see the Confirm Reservation screen  */}
      <Button
        title="Confirm Reservation"
        onPress={() =>
          navigation.navigate("Confirm Reservation", {
            listingID: "jiSekHJ6RwbGOuNMMPZq",
            renterEmail: route.params.email,
          })
        }
      />
    </SafeAreaView>
  );
}
