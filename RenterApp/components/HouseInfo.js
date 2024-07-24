import {
    Text,
    View,
    StyleSheet,
    Image,
  } from "react-native";
  
  const defaultImage =
    "https://www.bhg.com/thmb/H9VV9JNnKl-H1faFXnPlQfNprYw=/1799x0/filters:no_upscale():strip_icc()/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg";
  
  export default function HouseInfo({
    houseImage = defaultImage,
    pricePerNight = 333,
    noOfGuests = 2,
    noOfBeds = 1,
    noOfBathrooms = 1,
    address = "55 Front St W",
    city = "Toronto",
    isPendingApproval = false,
    isApproved = false,
    isDeclined = false,
  }) {
    return (
      <View style={[{}]}>
        <Image
          source={{
            uri: houseImage,
        }
          }
          style={[styles.houseImage]}
        />
  
        <Text style={[styles.locationText]}>{address}, {city}</Text>
        {/* <Text style={[{}]}>25km away</Text> */}
        <Text style={[{}]}>${pricePerNight} CAD/night</Text>
        <Text style={[{ color: "gray" }]}>
          {noOfGuests} guests - {noOfBeds} bedroom - {noOfBathrooms} bath
        </Text>
  
        {/* If this is pending approval, add an overlay */}
        {isPendingApproval && (
          <View style={styles.overlay}>
            <Text style={[styles.overlayText, { color: "yellow" }]}>
              Pending approval
            </Text>
          </View>
        )}
  
        {/* If this is declined by owner, add an overlay */}
        {isDeclined && (
          <View style={styles.overlay}>
            <Text style={[styles.overlayText, { color: "red" }]}>Declined</Text>
          </View>
        )}
  
      </View>
    );
  }
  
  const styles = StyleSheet.create({
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
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
    },
    overlayText: {
      fontSize: 18,
      fontWeight: "bold",
      backgroundColor: 'black'
    },
  });
  