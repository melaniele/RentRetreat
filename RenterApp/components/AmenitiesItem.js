import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const amenityIconMapping = {
  WiFi: "wifi",
  Kitchen: "utensils",
  Parking: "car",
  "A/C": "snowflake",
  TV: "tv",
  HotTub: "hot-tub",
};

export default function AmenitiesItem({ amenity }) {

  // Get the appropriate icon name based on the amenity name.
  // If it doesn't exist in the mapping, use the question icon as a safeguard
  const iconName = amenityIconMapping[amenity] || "question";

  return (
    <View style={styles.container}>
      <FontAwesome5 name={iconName} size={25} color="gray" />
      <Text style={styles.text}>{amenity}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  text: {
    marginLeft: 15,
    color: "gray",
    fontSize: 22,
  },
});
