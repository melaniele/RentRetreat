import { StyleSheet } from "react-native";

export const discoverStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  priceMarker: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

  },
  priceMarkerText: {
    color: "black",
    fontWeight: 'bold'
  },
  modalView: {
    marginTop: 200,
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
    shadowRadius: 10,
    elevation: 10,
  },
  modalCloseButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  modalAddress: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    padding: 5
  },
  description:{
    fontSize: 15,
    padding: 5
  },
  modalImage: {
    width: 300,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
    padding: 5

  },
  modalPrice: {
    fontSize: 20,
    color: "green",
    padding: 5,
    fontWeight: "bold"

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
