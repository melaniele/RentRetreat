import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/Login";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabContainerComponent = () => (
  <Tab.Navigator>
    <Tab.Screen name="Create Rental" component={CreateRental} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
