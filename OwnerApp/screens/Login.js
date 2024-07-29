import { FontAwesome5 } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
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
import { auth, db } from "../firebaseConfig";
import { useAuth } from "../store/AuthContext";

export default Login = ({ navigation }) => {
  const { setLoggedInUserEmail } = useAuth();
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

        // validate login
        validateResult = await validateLogin(userCredential.user.email);
        if (validateResult) {
          setLoggedInUserEmail(userCredential.user.email);
          navigation.navigate("Home", {
            screen: "Create Rental",
          });
          handleClearFields();
        } else {
          setError("User is not an owner, please try again!");
        }
      } catch (error) {
        setError("Credentials are invalid, please try again!");
        console.log({ error });
      }
    }
  };

  // Validate whether user is an owner or not
  const validateLogin = async (userEmail) => {
    try {
      const userQuery = query(
        collection(db, "users"),
        where("email", "==", userEmail)
      );

      const querySnapshot = await getDocs(userQuery);
      let isOwner = false;
      querySnapshot.forEach((currDoc) => {
        const user = {
          id: currDoc.id,
          ...currDoc.data(),
        };
        if (user.userType === "owner") {
          isOwner = true;
        }
      });

      return isOwner;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleClearFields = () => {
    setEmailAddress("");
    setPassword("");
    setError("");
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
          <Text style={[loginStyles.textShadow, loginStyles.ownerTitle]}>
            {"Create your\nrental today!"}
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
              autoCapitalize="none"
              autoCorrect={false}
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
