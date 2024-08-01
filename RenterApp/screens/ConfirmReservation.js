import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { db } from '../firebaseConfig';
import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import HouseInfo from '../components/HouseInfo';
import AmenitiesItem from '../components/AmenitiesItem';
import RNDateTimePicker, {
  DateTimePicker,
} from '@react-native-community/datetimepicker';
import { useAuth } from '../components/AuthContext';

const SAMPLE_LISTING = {
  address: '223 Sheppard Ave W',
  amenities: ['A/C', 'Kitchen', 'Parking', 'WiFi', 'TV', 'HotTub'],
  city: 'North York',
  description: 'NO PARTIES ALLOWED!!!',
  houseImage:
    'https://www.bhg.com/thmb/H9VV9JNnKl-H1faFXnPlQfNprYw=/1799x0/filters:no_upscale():strip_icc()/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg',
  lat: 43.761418,
  lng: -79.4121722,
  noOfBathrooms: 1,
  noOfBeds: 1,
  noOfGuests: 4,
  ownerEmail: 'owner1@gmail.com',
  pricePerNight: 100,
  status: 'confirmed',
};

const SAMPLE_OWNER = {
  email: 'owner1@gmail.com',
  firstname: 'Olivia',
  lastname: 'Zhang',
  picture: 'https://randomuser.me/api/portraits/women/2.jpg',
  userType: 'owner',
};

export default function ConfirmReservation({ route }) {
  const { loggedInUserEmail } = useAuth();
  const [listingInfo, setListingInfo] = useState({});
  const [userHasReservation, setUserHasReservation] = useState(false);
  const [reservationConfirmIsLoading, setReservationConfirmIsLoading] =
    useState(false);
  const [ownerInfo, setOwnerInfo] = useState({});

  // This is the minimum date that a user can select for the check-in date.
  // By default, it is set to the current date.
  // This is only a temporary implementation as the requirements specify that a user cannot choose their dates.
  // So, the availableStartDate will be set to the first available date based on how many users have already reserved the listing.
  const [selectedFromDate, setSelectedFromDate] = useState(new Date());

  // sets selectedToDate to be the next day by default
  const [selectedToDate, setSelectedToDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  const [totalDays, setTotalDays] = useState(1);

  const getDifferenceInDays = () => {
    const diffenceTime = Math.abs(selectedToDate - selectedFromDate);
    const differenceDays = Math.ceil(diffenceTime / (1000 * 60 * 60 * 24));
    return differenceDays;
  };

  const getMinimumToDate = () => {
    const minDate = new Date(selectedFromDate);
    minDate.setDate(minDate.getDate() + 1);
    return minDate;
  };

  const handleFromDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedFromDate;
    setSelectedFromDate(currentDate);
    setTotalDays(getDifferenceInDays());
  };

  const handleToDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setSelectedToDate(currentDate);
    setTotalDays(getDifferenceInDays());
  };

  const handleConfirmReservation = async () => {
    // If the user already has a reservation, then return to avoid creating another one.
    // This is a temporary implementation as we are only allowing a user to have one reservation for a listing.
    // A future implementation should allow a user to have multiple reservations for a listing based on dates.
    if (userHasReservation) {
      return;
    }

    // Convert the values to timestamps
    const fromDate = selectedFromDate.getTime();
    const untilDate = selectedToDate.getTime();

    const reservationRequest = {
      listingID: route.params.listingID,
      checkinDate: fromDate,
      checkoutDate: untilDate,
      status: 'CONFIRMED',
      ownerEmail: listingInfo.ownerEmail,
      renterEmail: route.params.renterEmail,
      totalPrice: listingInfo.pricePerNight * totalDays,
    };

    // Insert the reservation request into the database
    // console.log('Adding reservation request to the database');
    try {
      setReservationConfirmIsLoading(true);
      const docRef = await addDoc(
        collection(db, 'reservationRequests'),
        reservationRequest
      );
      setReservationConfirmIsLoading(false);

      // console.log('Document written with ID: ', docRef.id);
      Alert.alert(
        'Reservation Confirmed',
        'Your reservation has been confirmed. Your confirmation ID is: ' +
          docRef.id
      );
      setUserHasReservation(true);
    } catch (err) {
      console.log(err);
      setReservationConfirmIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Logged in user email: ', loggedInUserEmail);
    fetchListingInfo();
    console.log(route.params.renterEmail);
    // For testing purposes
    // setListingInfo(SAMPLE_LISTING);
    // fetchOwnerInfo("owner1@gmail.com")
  }, []);

  const fetchListingInfo = async () => {
    try {
      const docRef = doc(db, 'listings', route.params.listingID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        setListingInfo(docSnap.data());

        fetchAmountOfReservationsForMinimumDate();

        // Check if the user has a reservation for this listing
        checkIfUserHasReservation();

        // Once we have the information about the listing, we can fetch the owner's information.
        fetchOwnerInfo(docSnap.data().ownerEmail);
      } else if (docSnap.data() === undefined) {
        console.log('No such document!');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkIfUserHasReservation = async () => {
    try {
      // OPTIONALLY: Add a check to see if the user has a reservation for the same dates.
      // This is a temporary implementation as we are only allowing a user to have one reservation for a listing.
      // A future implementation should allow a user to have multiple reservations for a listing based on dates.
      const reservationQuery = query(
        collection(db, 'reservationRequests'),
        where('renterEmail', '==', loggedInUserEmail),
        where('listingID', '==', route.params.listingID)
      );

      const querySnapshot = await getDocs(reservationQuery);

      // If a reservation exists, then set the userHasReservation to true
      if (!querySnapshot.empty) {
        setUserHasReservation(true);
      } else {
        setUserHasReservation(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOwnerInfo = async (ownerEmail) => {
    try {
      // create a query
      const getUserByEmailQuery = query(
        collection(db, 'users'),
        where('email', '==', ownerEmail)
      );

      const querySnapshot = await getDocs(getUserByEmailQuery);

      querySnapshot.forEach((currDoc) => {
        // console.log(currDoc.id, " => ", currDoc.data());
        setOwnerInfo(currDoc.data());
      });
    } catch (err) {
      console.log(err);
    }
  };

  fetchAmountOfReservationsForMinimumDate = async () => {
    const reservationQuery = query(
      collection(db, 'reservationRequests'),
      where('listingID', '==', route.params.listingID)
    );

    const querySnapshot = await getDocs(reservationQuery);

    
    // If there are no results, then no one has the a reservation and the date will be set to the current date.
    // Simply return as the default values are already proper.
    if (querySnapshot.empty) {
      return;
    }

    // Get length of querySnapshot
    const amountOfReservations = querySnapshot.size;
    // console.log('Amount of reservations: ', amountOfReservations);
    setSelectedFromDate(new Date(new Date().setDate(new Date().getDate() + amountOfReservations)));
    setSelectedToDate(new Date(new Date().setDate(new Date().getDate() + amountOfReservations + 1)));
  }
  return (
    <View style={[styles.container]}>
      <ScrollView>
        {/* House image and basic info */}
        <HouseInfo
          address={listingInfo.address}
          houseImage={listingInfo.houseImage}
          pricePerNight={listingInfo.pricePerNight}
          noOfGuests={listingInfo.noOfGuests}
          noOfBeds={listingInfo.noOfBeds}
          noOfBathrooms={listingInfo.noOfBathrooms}
          city={listingInfo.city}
        />

        {/* Owner Info */}
        <View style={[styles.ownerView]}>
          <Image
            source={{ uri: ownerInfo.picture }}
            style={{ width: 65, height: 65, borderRadius: 30 }}
          />
          <Text style={styles.ownerNameText}>
            {ownerInfo.firstname} {ownerInfo.lastname}
          </Text>
        </View>

        {/* Description */}
        <View>
          <Text style={styles.headingTitle}>Description</Text>
          <View style={[styles.divider]}></View>
          <Text style={[{ color: 'gray' }]}>{listingInfo.description}</Text>
        </View>

        {/* What this place offers */}
        <View style={[{ marginTop: 20 }]}>
          <Text style={styles.headingTitle}>What This Place Offers</Text>
          <View style={[styles.divider]}></View>

          {/* Make this a FlatList */}
          <FlatList
            data={listingInfo.amenities}
            renderItem={({ item }) => <AmenitiesItem amenity={item} />}
            keyExtractor={(item) => item}
          />
        </View>

        {/* Pick Dates */}
        <View style={[{ marginTop: 20 }]}>
          <Text style={[styles.headingTitle]}>Pick Your Dates</Text>
          <View style={[styles.divider]}></View>

          <View style={[styles.datePickerContainer]}>
            <View style={[styles.datePickerSection]}>
              <Text style={styles.dateLabel}>Check-in</Text>
              <RNDateTimePicker
                style={[styles.datePicker]}
                mode='date'
                display='default'
                onChange={handleFromDateChange}

                // Typically, the minimum date should be the current date.
                // However, the requirements specify that a user cannot choose their dates and the implementation
                // Simply takes the first available date based on how many users have already reserved the listing.
                minimumDate={selectedFromDate}

                // Maximum added as the requirements specify that a user cannot choose their dates.
                maximumDate={new Date()}
                value={selectedFromDate}
              />
            </View>
            <View style={[styles.datePickerSection]}>
              <Text style={[styles.dateLabel, { marginLeft: 10 }]}>
                Check-out
              </Text>
              <RNDateTimePicker
                style={[styles.datePicker]}
                mode='date'
                display='default'
                onChange={handleToDateChange}
                // Minimum date should be the next day of the Check-in date.
                minimumDate={getMinimumToDate()}
                // Added maximum date to be the same value as minimum as the requirements
                // specify that a user cannot choose their dates. Though, this property
                // can be removed to allow the user to choose their own dates if needed.
                maximumDate={getMinimumToDate()}
                value={selectedToDate}
              />
            </View>
          </View>
        </View>
        <View style={[styles.divider, { marginTop: 15 }]}></View>

        {/* Total Price */}
        <View style={[styles.totalPriceView]}>
          <Text style={[styles.totalPriceText]}>
            Total Price: ${listingInfo.pricePerNight * totalDays} CAD
          </Text>
        </View>
        <View>

          {/* The pressable is always shown but grays out if a user already has a reservation */}
          {/* A loading indicator is shown upon fetching */}
          <Pressable
            style={[
              styles.confirmPressable,
              ,
              userHasReservation && { backgroundColor: 'gray' },
            ]}
            onPress={handleConfirmReservation}
          >
            {reservationConfirmIsLoading ? (
              <ActivityIndicator size='large' color='#0000ff' />
            ) : (
              <Text style={[styles.confirmPressableText]}>
                {userHasReservation ? 'Reserved' : 'Confirm Reservation'}
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
    flex: 1,
  },
  houseImage: {
    width: '100%',
    height: 200,
    resizeMode: 'center',
    borderRadius: 15,
  },
  locationText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  ownerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  ownerNameText: {
    fontSize: 25,
    marginLeft: 10,
  },
  headingTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'black',
    marginVertical: 5,
  },
  totalPriceView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmPressable: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  confirmPressableText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
  },
  totalPriceText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
  },

  datePickerContainer: {
    flexDirection: 'row',
    marginTop: 1,
  },
  datePickerSection: {
    flex: 1,
    alignItems: 'center',
    // flexDirection: "row",
    justifyContent: 'flex-start',
    marginLeft: 0,
  },
  dateLabel: {
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1,
  },
  datePicker: {
    flex: 3,
  },
});
