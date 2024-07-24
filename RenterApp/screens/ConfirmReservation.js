import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import HouseInfo from "../components/HouseInfo";

const SAMPLE_LISTING = {
  address: "223 Sheppard Ave W",
  amenities: ["A/C", "Kitchen"],
  city: "North York",
  description: "NO PARTIES ALLOWED!!!",
  houseImage:
    "https://www.bhg.com/thmb/H9VV9JNnKl-H1faFXnPlQfNprYw=/1799x0/filters:no_upscale():strip_icc()/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg",
  lat: 43.761418,
  lng: -79.4121722,
  noOfBathrooms: 1,
  noOfBeds: 1,
  noOfGuests: 4,
  ownerEmail: "owner1@gmail.com",
  pricePerNight: 100,
  status: "confirmed",
};

export default function ConfirmReservation({ route }) {
  const [listingInfo, setListingInfo] = useState({});

  useEffect(() => {
    fetchListingInfo();

    // For testing purposes
    // setListingInfo(SAMPLE_LISTING);
  }, []);

  const fetchListingInfo = async () => {
    try {
      const docRef = doc(db, "listings", route.params.listingID);

      // Attempt to get the specified document
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setListingInfo(docSnap.data());
      } else if (docSnap.data() === undefined) {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={[styles.container]}>
      <ScrollView>
        {/* House image and basic info */}
        {/* TODO: Maybe make this a component as it can be reused in every other screen */}

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
            source={{ uri: "https://randomuser.me/api/portraits/men/18.jpg" }}
            style={{ width: 65, height: 65, borderRadius: 30 }}
          />
          <Text style={styles.ownerNameText}>John Doe</Text>
        </View>

        {/* Description */}
        <View>
          <Text style={styles.headingTitle}>Description</Text>
          <View style={[styles.divider]}></View>
          <Text style={[{ color: "gray" }]}>{listingInfo.description}</Text>
        </View>

        {/* What this place offers */}
        <View style={[{ marginTop: 20 }]}>
          <Text style={styles.headingTitle}>What This Place Offers</Text>
          <View style={[styles.divider]}></View>

          {/* Make this a FlatList */}
          <View
            style={[
              { flexDirection: "row", alignItems: "center", marginVertical: 5 },
            ]}
          >
            <FontAwesome5 name="snowflake" size={25} color="gray" />
            <Text style={[{ marginLeft: 15, color: "gray", fontSize: 22 }]}>
              Air conditioning
            </Text>
          </View>

          {/* Add to flatList*/}
          <View
            style={[
              { flexDirection: "row", alignItems: "center", marginVertical: 5 },
            ]}
          >
            <FontAwesome5 name="tv" size={19} color="gray" />
            <Text style={[{ marginLeft: 15, color: "gray", fontSize: 22 }]}>
              TV
            </Text>
          </View>
        </View>

        {/* Pick Dates */}
        {/* 
           TODO: Sent an email asking if we can use the date picker library:
  
              https://www.npmjs.com/package/react-native-date-picker 
              
              If not, we can use the Picker library from Week 8.
          */}
        <View style={[{ marginTop: 20 }]}>
          <Text style={styles.headingTitle}>Pick Your Dates</Text>
          <View style={[styles.divider]}></View>

          <View style={[{ flexDirection: "row", marginTop: 10, gap: 5 }]}>
            <Text style={[{ fontWeight: "bold", fontSize: 20, flex: 1 }]}>
              From
            </Text>
            <View
              style={[
                { backgroundColor: "lightgray", height: "100%", flex: 3 },
              ]}
            ></View>
            <View
              style={[
                { backgroundColor: "lightgray", height: "100%", flex: 3 },
              ]}
            ></View>
          </View>
          <View style={[{ flexDirection: "row", marginTop: 10, gap: 5 }]}>
            <Text style={[{ fontWeight: "bold", fontSize: 20, flex: 1 }]}>
              To
            </Text>
            <View
              style={[
                { backgroundColor: "lightgray", height: "100%", flex: 3 },
              ]}
            ></View>
            <View
              style={[
                { backgroundColor: "lightgray", height: "100%", flex: 3 },
              ]}
            ></View>
          </View>
        </View>

        {/* Total Price (calculated from date * PricePerNight) */}
        <View style={[styles.totalPriceView]}>
          <Text style={[styles.totalPriceText]}>Total Price: $333 CAD</Text>
        </View>
        <View>
          <Pressable style={[styles.confirmPressable]}>
            <Text style={[styles.confirmPressableText]}>
              Confirm Reservation
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "white",
    flex: 1,
  },
  houseImage: {
    width: "100%",
    height: 200,
    resizeMode: "center",
    borderRadius: 15,
  },
  locationText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  ownerView: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  ownerNameText: {
    fontSize: 25,
    marginLeft: 10,
  },
  headingTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "black",
    marginVertical: 5,
  },
  totalPriceView: {
    justifyContent: "center",
    alignItems: "center",
  },
  confirmPressable: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  confirmPressableText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
  },
  totalPriceText: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 20,
  },
});
