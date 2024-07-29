import { Text, View, FlatList } from "react-native";
import { useAuth } from "../components/AuthContext";
import { useEffect, useState } from "react"
import { useIsFocused } from "@react-navigation/native"
import { db } from '../firebaseConfig';
import { collection, getDocs, where, query } from "firebase/firestore"
import { myReservationsStyles } from '../css/myReservationsStyles';
import HouseInfo from "../components/HouseInfo";
import UserInfo from "../components/UserInfo";

export default function MyReservations() {
  const { loggedInUserEmail } = useAuth();
  const [reservationList, setReservationList] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const isUserOnThisScreen = useIsFocused()

  useEffect(() => {
    if (isUserOnThisScreen) {
      getDataFromDB()
    }
  }, [isUserOnThisScreen])

  const onRefresh = () => {
    setIsRefreshing(true)
    getDataFromDB()
  }

  const getDataFromDB = async () => {
    const listings = []
    try {
      const q = query(collection(db, "reservationRequests"), where("renterEmail", "==", loggedInUserEmail))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        listings.push({
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
    }

    try {
      const updatedReservedListings = await Promise.all(
        listings.map(async (reservedListing) => {
          const listingsRef = collection(db, 'listings');
          const querySnapshot = await getDocs(listingsRef);
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

          const usersRef = query(collection(db, 'users'), where("userType", "==", "owner"));
          const querySnapshotUsers = await getDocs(usersRef);
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

      setReservationList(updatedReservedListings);
    } catch (error) {
      console.error(
        'Error getting documents from listings/users db: ',
        error
      );
    }
    setIsRefreshing(false)
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
      <FlatList
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        style={myReservationsStyles.reservedListingsList}
        data={reservationList}
        renderItem={renderListings}
        keyExtractor={(item) => item.reservationRequestID}
      />
    </View>
  );
}