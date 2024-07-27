import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome5 } from "@expo/vector-icons";

import Login from "./screens/Login";
import Discover from "./screens/Discover";
import ConfirmReservation from "./screens/ConfirmReservation";
import MyReservations from "./screens/MyReservations";
import { AuthProvider } from "./components/AuthContext";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabContainerComponent = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused }) => {
        if (route.name == "Discover") {
          return <FontAwesome5 name="home" size={24} color={focused ? "black" : "gray"} />;
        }
        if (route.name === "My Reservations") {
          return <FontAwesome5 name="calendar-alt" size={24} color={focused ? "black" : "gray"} />;
        }
      },
      tabBarActiveTintColor: "black",
      tabBarInactiveTintColor: "gray",
    })}
  >
    <Tab.Screen name="Discover" component={Discover} 
    options={{
      headerShown: true,
    }}
    />
    <Tab.Screen name="My Reservations" component={MyReservations} 
    options={{
      headerShown: true,
    }}
    />
  </Tab.Navigator>
);

export default function App() {
  return (
    <AuthProvider>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen component={Login} name="Login" />
        <Stack.Screen component={TabContainerComponent} name="Home" />
        <Stack.Screen component={ConfirmReservation} name="Confirm Reservation"
        options={{
          headerShown: true,
        }}/>
      </Stack.Navigator>
    </NavigationContainer>
    </AuthProvider>
  );
}
