import { StyleSheet } from "react-native";

export const discoverStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  userMarker: {
    backgroundColor: "blue",
    padding: 5,
    borderRadius: 5,
  },
  userMarkerText: {
    color: "white",
  },
  priceMarker: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  priceMarkerText: {
    color: "white",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  modalImage: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  modalPrice: {
    fontSize: 20,
    color: "green",
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
