import { StyleSheet } from 'react-native';

export const createRentalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: 25,
    gap: 50
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
    // alignItems: 'center',
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
  },
  sectionHeaderText: {
    fontWeight: '400', fontSize: 30, textAlign: 'center', color: '#4C4C4C'
  },
  sectionHeaderDivider: {
    borderWidth: 0.5, borderColor: "#B7B7B7", marginVertical: 1
  },
  fullWidth: {
    width: '100%'
  },
  inputHeaderText: {
    fontSize: 20, paddingBottom: 5, fontWeight: '300'
  },
  textInput: {
    borderWidth: 1, fontSize: 20, paddingHorizontal: 10, borderRadius: 4, height: 50, width: '100%', borderColor: 'gray', backgroundColor: 'white'
  },
  descriptionTextInput: {
    borderWidth: 1, fontSize: 20, paddingHorizontal: 10, borderRadius: 4, height: 150, width: '100%', borderColor: 'gray'
  },
  button: {
    backgroundColor: '#4CAF50', // A modern green color
    borderRadius: 8, // More rounded corners
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 15,
  },
  
});
