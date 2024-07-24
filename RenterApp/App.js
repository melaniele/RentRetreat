import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./screens/Login";
import Discover from "./screens/Discover";
import ConfirmReservation from "./screens/ConfirmReservation";
import MyReservations from "./screens/MyReservations";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabContainerComponent = () => (
  <Tab.Navigator>
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
  );
}
