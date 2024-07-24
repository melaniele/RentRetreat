import { StyleSheet } from 'react-native';

export const createRentalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    height: 40,
    width: 100,
    margin: 12,
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 10
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 15
  },
  text: {
    fontSize: 20
  },
  pressable: {
    width: 150,
    backgroundColor: '#2980b9',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    border: 'black solid',
    marginTop: 15
  },
  createRentalText: {
    fontSize: 20,
    color: 'black'
  }
});
