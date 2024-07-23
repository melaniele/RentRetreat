import { FontAwesome5 } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { loginStyles } from "../css/loginStyles";
import { auth } from "../firebaseConfig";

export default Login = ({ navigation }) => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [emailAddress, password]);

  const onLoginClicked = async () => {
    if (emailAddress === "" || password === "") {
      setError("Email and Password cannot be empty.");
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          emailAddress,
          password
        );
        console.log("login successful");
        //navigation.navigate("Home", {user: emailAddress});
      } catch (error) {
        setError("Credentials are invalid, please try again!");
        console.log({ error });
      }
    }
  };

  return (
    <ImageBackground
      source={require("./../assets/loginPage.jpeg")}
      style={loginStyles.backgroundImage}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={loginStyles.keyboardAvoidingView}
      >
        <SafeAreaView style={loginStyles.container}>
          <Text style={[loginStyles.title, loginStyles.textShadow]}>
            Welcome to RentRetreat
          </Text>

          <View style={loginStyles.loginSection}>
            <Text style={[loginStyles.label, loginStyles.textShadow]}>
              Login your account
            </Text>
            <TextInput
              style={loginStyles.input}
              placeholder="Username/Email"
              value={emailAddress}
              onChangeText={setEmailAddress}
            />
            <TextInput
              style={loginStyles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {error && (
              <View style={loginStyles.errorView}>
                <Text style={loginStyles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={loginStyles.button}
              onPress={onLoginClicked}
            >
              <Text style={loginStyles.buttonText}>
                Login
                <View style={loginStyles.icon}>
                  <FontAwesome5 name="arrow-right" size={18} color="white" />
                </View>
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};
