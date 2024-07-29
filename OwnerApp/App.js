import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign, Octicons } from '@expo/vector-icons';

import Login from './screens/Login.js';
import CreateRental from './screens/CreateRental.js';
import ManageBookings from './screens/ManageBookings.js';
import { AuthProvider } from './store/AuthContext.js';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabContainerComponent = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Create Rental"
        component={CreateRental}
        options={{
          headerShown: true,
          tabBarLabel: 'Create Rental',
          tabBarIcon: ({ color, size }) => (
            <AntDesign
              name="form"
              color={color}
              size={size}
            />
          )
        }}
      />
      <Tab.Screen
        name="Manage Bookings"
        component={ManageBookings}
        options={{
          headerShown: true,
          tabBarLabel: 'Manage Bookings',
          tabBarIcon: ({ color, size }) => (
            <Octicons
              name="gear"
              color={color}
              size={size}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            component={Login}
            name="Login"
          />
          <Stack.Screen
            component={TabContainerComponent}
            name="Home"
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
