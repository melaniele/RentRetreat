import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from "../store/AuthContext";
import { useEffect, useState } from "react"
import { useIsFocused } from "@react-navigation/native"
import { db } from '../firebaseConfig';

import { collection, getDocs, where, query } from "firebase/firestore"
import { myReservationsStyles } from '../css/myReservationsStyles';
import HouseInfo from "../components/HouseInfo";
import UserInfo from "../components/UserInfo";
import LogoutButton from '../components/LogoutButton';
export default function MyReservations({ navigation }) {
  const { loggedInUserEmail, userCityLocation } = useAuth();

  const [reservationList, setReservationList] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const isUserOnThisScreen = useIsFocused()
  const [isLoading, setIsLoading] = useState(true);

  const setHeader = () => {
    navigation.setOptions({
      headerRight: () => (
        <LogoutButton />
      )
    });
  };

  useEffect(() => {
    if (isUserOnThisScreen) {
      setHeader();
      getDataFromDB()
    }
  }, [isUserOnThisScreen])

  const onRefresh = () => {
    setIsRefreshing(true)
    getDataFromDB()
  }

  const getDataFromDB = async () => {
    setIsLoading(true);
    const reservationRequests = [];
    try {
      const q = query(collection(db, "reservationRequests"), where("renterEmail", "==", loggedInUserEmail))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        reservationRequests.push({
          listingID: doc.data().listingID,
          ownerEmail: doc.data().ownerEmail,
          reservationRequestID: doc.id,
          status: doc.data().status
        });
      })
    } catch (error) {
      console.error(
        'Error getting documents from reservationRequests db: ',
        error
      );
      setIsLoading(false);
      return;
    }

    try {
      // Gets the listings from the listings collection but for the user's city
      const listingsRef = query(collection(db, 'listings'), where("city", "==", userCityLocation));
      const querySnapshot = await getDocs(listingsRef);

      // Gets the users from the users collection but for owner accounts.
      const usersRef = query(collection(db, 'users'), where("userType", "==", "owner"));
      const querySnapshotUsers = await getDocs(usersRef);


      let updatedReservedListings = await Promise.all(
        reservationRequests.map(async (reservedListing) => {
          querySnapshot.forEach((doc) => {
            if (
              doc.data().ownerEmail === reservedListing.ownerEmail &&
              doc.id === reservedListing.listingID
            ) {
              Object.assign(reservedListing, {
                address: doc.data().address,
                amenities: doc.data().amenities,
                city: doc.data().city,
                description: doc.data().description,
                houseImage: doc.data().houseImage,
                lat: doc.data().lat,
                lng: doc.data().lng,
                noOfBathrooms: doc.data().noOfBathrooms,
                noOfBeds: doc.data().noOfBeds,
                noOfGuests: doc.data().noOfGuests,
                pricePerNight: doc.data().pricePerNight,
                ownerEmail: doc.data().ownerEmail
              });
            }
          });

          querySnapshotUsers.forEach((doc) => {
            if (doc.data().email === reservedListing.ownerEmail) {
              Object.assign(reservedListing, {
                ownerEmail: doc.data().email,
                firstname: doc.data().firstname,
                lastname: doc.data().lastname,
                picture: doc.data().picture,
                userType: doc.data().userType
              });
            }
          });
          return reservedListing;
        })
      );

      updatedReservedListings = updatedReservedListings.filter((listing) => {
        return listing.city === undefined ? false : true;
      });

      setReservationList(updatedReservedListings);
    } catch (error) {
      console.error(
        'Error getting documents from listings/users db: ',
        error
      );
    }
    setIsRefreshing(false)
    setIsLoading(false);
  }

  const renderListings = ({ item }) => {
    return (
      <View style={myReservationsStyles.listItem}>
        <HouseInfo
          houseImage={item.houseImage}
          pricePerNight={item.pricePerNight}
          noOfGuests={item.noOfGuests}
          noOfBeds={item.noOfBeds}
          noOfBathrooms={item.noOfBathrooms}
          address={item.address}
          city={item.city}
        />
        <UserInfo
          picture={item.picture}
          firstname={item.firstname}
          lastname={item.lastname}
        />
        <View
          style={{
            flexDirection: 'row'
          }}
        >
          <View
            style={{
              ...myReservationsStyles.statusAndConfirmationContainer,
              paddingRight: 10
            }}
          >
            <Text>Status</Text>
            <Text
              style={{
                fontWeight: 'bold',
                color:
                  item.status.toUpperCase() === 'CANCELLED'
                    ? 'red'
                    : item.status.toUpperCase() === 'CONFIRMED'
                      ? 'green'
                      : 'black'
              }}
            >
              {item.status.toUpperCase()}
            </Text>
          </View>
          <View style={myReservationsStyles.verticalBar} />
          <View
            style={{
              ...myReservationsStyles.statusAndConfirmationContainer,
              paddingLeft: 10
            }}
          >
            <Text>Confirmation Code</Text>
            <Text style={{ fontWeight: 'bold' }}>
              {item.reservationRequestID}
            </Text>
          </View>
        </View>
      </View>
    );
  };


  return (
    <View style={myReservationsStyles.container}>
      {isLoading ? (
        <ActivityIndicator
          size='large'
          color='#0000ff'
          animating={true}
          style={{ marginTop: 20 }}
        />
      ) : reservationList.length === 0 ? (
        <Text
          style={{
            fontSize: 20,
            paddingBottom: 10,
            color: '#6ab04c',
            fontWeight: 'bold',
            marginHorizontal: 20,
          }}
        >
          No listings found! Either you have no reservations or the listings you
          have reserved are not in your city: {userCityLocation}.
        </Text>
      ) : (
        <FlatList
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          style={myReservationsStyles.reservedListingsList}
          data={reservationList}
          renderItem={renderListings}
          keyExtractor={(item) => item.reservationRequestID}
        />
      )}
    </View>
  );
}