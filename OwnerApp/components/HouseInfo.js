import { Text, View, StyleSheet, Image } from 'react-native';

const defaultImage =
  'https://www.bhg.com/thmb/H9VV9JNnKl-H1faFXnPlQfNprYw=/1799x0/filters:no_upscale():strip_icc()/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg';

export default function HouseInfo({
  houseImage = defaultImage,
  pricePerNight = 333,
  noOfGuests = 2,
  noOfBeds = 1,
  noOfBathrooms = 1,
  address = '55 Front St W',
  city = 'Toronto'
}) {
  return (
    <View>
      <Image
        source={{
          uri: houseImage
        }}
        style={[styles.houseImage]}
      />

      <Text style={[styles.locationText]}>
        {address}, {city}
      </Text>
      <Text>${pricePerNight} CAD/night</Text>
      <Text>
        {noOfGuests} guests - {noOfBeds} bedroom - {noOfBathrooms} bath
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  houseImage: {
    width: '100%',
    height: 200,
    resizeMode: 'center',
    borderRadius: 15
  },
  locationText: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingTop: 10
  }
});
