import { StyleSheet } from 'react-native';

export const myReservationsStyles = StyleSheet.create({
  reservedListingsList: {
    alignContent: 'stretch',
    width: '100%',
    padding: 30,
  },
  container: {
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center'
  },
  listItem: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusAndConfirmationContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  noListingsFound: {
    fontSize: 20,
    paddingBottom: 10,
    color: '#6ab04c',
    fontWeight: 'bold'
  },
  header: {
    backgroundColor: '#2C3A47',
    borderRadius: 5,
    marginRight: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
    padding: 5
  },
  verticalBar: {
    width: 2,
    height: 50,
    backgroundColor: 'black',
    borderRadius: 5
  }
});
