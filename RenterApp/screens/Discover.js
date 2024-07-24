import { Text, View, Button } from "react-native";

export default function Discover({navigation}) {
  return (
    <View>
      <Text>Discover</Text>
      
        {/*Temporary - Added so that we can navigate and see the Confirm Reservation screen  */}
        <Button title="Confirm Reservation" onPress={() => navigation.navigate('Confirm Reservation', {listingID: 'jiSekHJ6RwbGOuNMMPZq'})} />
    </View>
  );
}