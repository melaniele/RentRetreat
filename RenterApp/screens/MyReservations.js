import { Text, View } from "react-native";
import { useAuth } from "../components/AuthContext";

export default function MyReservations() {
  const { loggedInUserEmail } = useAuth();
    return (
      <View>
        <Text>{loggedInUserEmail}</Text>
        <Text>My Reservations</Text>
      </View>
    );
  }