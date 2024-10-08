import { useIsFocused } from "@react-navigation/native";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HouseInfo from "../components/HouseInfo";
import UserInfo from "../components/UserInfo";
import { manageBookingsStyles } from "../css/manageBookingStyles";
import { db } from "../firebaseConfig";
import { useAuth } from "../store/AuthContext";
import LogoutButton
 from "../components/LogoutButton";

export default function ManageBookings({ navigation }) {
  const [reservedListings, setReservedListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isUserOnThisScreen = useIsFocused();
  const { loggedInUserEmail } = useAuth();

  const setHeader = () => {
    navigation.setOptions({
      headerRight: () => (
        <LogoutButton />
      ),
    });
  };

  useEffect(() => {
    getListings();
  }, [isUserOnThisScreen]);

  const cancelReservationRequest = async (reservationRequestID, listingID) => {
    Alert.alert(
      "Cancel Request",
      "Are you sure you want to cancel this reservation request?",
      [
        {
          text: "Yes",
          onPress: async () => {
            try {
              setIsLoading(true);
              const reservationRequestRef = doc(
                db,
                "reservationRequests",
                reservationRequestID
              );
              await updateDoc(reservationRequestRef, {
                status: "CANCELLED",
              });

              const listingRef = doc(db, "listings", listingID);
              await updateDoc(listingRef, {
                status: "CANCELLED",
              });

              getListings();
            } catch (error) {
              console.error("Error cancelling reservation request: ", error);
              setIsLoading(false);
            }
          },
        },
        {
          text: "No",
          onPress: () => {
            // Do nothing
          },
        },
      ]
    );
  };

  const getListings = async () => {
    if (isUserOnThisScreen) {
      setHeader();
      setIsLoading(true);
      const reservedListings = [];

      try {
        const reservationRequestsRef = collection(db, "reservationRequests");
        const querySnapshot = await getDocs(reservationRequestsRef);
        querySnapshot.forEach((doc) => {
          if (doc.data().ownerEmail === loggedInUserEmail) {
            reservedListings.push({
              listingID: doc.data().listingID,
              renterEmail: doc.data().renterEmail,
              reservationRequestID: doc.id,
              status: doc.data().status,
            });
          }
        });
      } catch (error) {
        console.error(
          "Error getting documents from reservationRequests db: ",
          error
        );
        setIsLoading(false);
        return;
      }

      try {
        const listingsRef = collection(db, "listings");
        const listingsQuerySnapshot = await getDocs(listingsRef);

        const usersRef = collection(db, 'users');
        const usersQuerySnapshot = await getDocs(usersRef);

        const updatedReservedListings = await Promise.all(
          reservedListings.map(async (reservedListing) => {
            listingsQuerySnapshot.forEach((doc) => {
              if (
                doc.data().ownerEmail === loggedInUserEmail &&
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
                  ownerEmail: doc.data().ownerEmail,
                });
              }
            });

            usersQuerySnapshot.forEach((doc) => {
              if (
                doc.data().userType === "renter" &&
                doc.data().email === reservedListing.renterEmail
              ) {
                Object.assign(reservedListing, {
                  renterEmail: doc.data().email,
                  firstname: doc.data().firstname,
                  lastname: doc.data().lastname,
                  picture: doc.data().picture,
                  userType: doc.data().userType,
                });
              }
            });

            return reservedListing;
          })
        );

        setReservedListings(updatedReservedListings);
      } catch (error) {
        console.error(
          "Error getting documents from listings/users db: ",
          error
        );
      }

      setIsLoading(false);
    }
  };

  const renderListings = ({ item }) => {
    return (
      <View style={manageBookingsStyles.listItem}>
        <TouchableOpacity
          onPress={() =>
            cancelReservationRequest(item.reservationRequestID, item.listingID)
          }
        >
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
              flexDirection: "row",
            }}
          >
            <View
              style={{
                ...manageBookingsStyles.statusAndConfirmationContainer,
                paddingRight: 10,
              }}
            >
              <Text>Status</Text>
              <Text
                style={{
                  fontWeight: "bold",
                  color:
                    item.status.toUpperCase() === "CANCELLED"
                      ? "red"
                      : item.status.toUpperCase() === "CONFIRMED"
                      ? "green"
                      : "black",
                }}
              >
                {item.status.toUpperCase()}
              </Text>
            </View>
            <View style={manageBookingsStyles.verticalBar} />
            <View
              style={{
                ...manageBookingsStyles.statusAndConfirmationContainer,
                paddingLeft: 10,
              }}
            >
              <Text>Confirmation Code</Text>
              <Text style={{ fontWeight: "bold" }}>
                {item.reservationRequestID}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={manageBookingsStyles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          animating={true}
          style={{ marginTop: 20 }}
        />
      ) : reservedListings.length === 0 ? (
        <Text style={manageBookingsStyles.noListingsFound}>
          No listings found! None of your listings have been reserved by a Renter yet!
        </Text>
      ) : (
        <FlatList
          style={manageBookingsStyles.reservedListingsList}
          data={reservedListings}
          renderItem={renderListings}
          keyExtractor={(item) => item.reservationRequestID}
        />
      )}
    </View>
  );
}
