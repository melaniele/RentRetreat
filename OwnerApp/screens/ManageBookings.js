import { StackActions, useIsFocused } from "@react-navigation/native";
import { signOut } from "firebase/auth";
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
import { auth, db } from "../firebaseConfig";
import { useAuth } from "../store/AuthContext";

export default function ManageBookings({ navigation }) {
  const [reservedListings, setReservedListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isUserOnThisScreen = useIsFocused();
  const { loggedInUserEmail } = useAuth();

  const logoutPressed = async () => {
    try {
      await signOut(auth);
      navigation.dispatch(StackActions.popToTop());
      console.log("user has been logged out");
    } catch (error) {
      console.error(`error logging out: ${error}`);
      Alert.alert(
        "Error logging out",
        `There was an error logging out: ${error}`
      );
    }
  };

  const setHeader = () => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            logoutPressed();
          }}
          style={{
            ...manageBookingsStyles.header,
            marginLeft: 15,
            backgroundColor: "#fa8231",
            padding: 5,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "black",
            }}
          >
            Sign Out
          </Text>
        </TouchableOpacity>
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
        const updatedReservedListings = await Promise.all(
          reservedListings.map(async (reservedListing) => {
            const listingsRef = collection(db, "listings");
            const querySnapshot = await getDocs(listingsRef);
            querySnapshot.forEach((doc) => {
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

            const usersRef = collection(db, "users");
            const querySnapshotUsers = await getDocs(usersRef);
            querySnapshotUsers.forEach((doc) => {
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
