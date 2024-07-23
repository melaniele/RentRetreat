import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 120,
    alignItems: "center",
  },
  loginSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  title: {
    fontSize: 45,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  textShadow: {
    padding: 20,
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1.5 },
    textShadowRadius: 22,
  },
  label: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "white",
    height: 55,
    width: 320,
    fontSize: 17,
  },
  button: {
    width: "100%",
    padding: 20,
    paddingHorizontal: 30,
    backgroundColor: "#00B2FF",
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  icon: {
    paddingLeft: 5,
  },
  errorView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});
