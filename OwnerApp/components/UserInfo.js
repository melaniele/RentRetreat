import { Text, View, StyleSheet, Image } from 'react-native';

export default function UserInfo({ picture, firstname, lastname }) {
  return (
    <View style={[styles.ownerView]}>
      <Image
        source={{ uri: picture }}
        style={{ width: 65, height: 65, borderRadius: 30 }}
      />
      <Text style={styles.ownerNameText}>
        {firstname} {lastname}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ownerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  ownerNameText: {
    fontSize: 20,
    marginLeft: 10
  }
});
