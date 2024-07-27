import { StyleSheet } from 'react-native';

export const manageBookingsStyles = StyleSheet.create({
  reservedListingsList: {
    alignContent: 'stretch',
    width: '80%'
  },
  container: {
    flex: 1,
    // backgroundColor: '#535c68',
    alignItems: 'center',
    justifyContent: 'center'
  },
  listItem: {
    width: '100%',
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
