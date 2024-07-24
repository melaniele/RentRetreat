export default function isUserInputValid(
  noOfBeds,
  noOfBathrooms,
  noOfGuests,
  description,
  price,
  city,
  address
) {
  if (
    !noOfBeds ||
    !noOfBathrooms ||
    !noOfGuests ||
    !description ||
    !price ||
    !city ||
    !address
  ) {
    alert('All fields are required');
    return false;
  }
  if (
    isNaN(noOfBeds) ||
    noOfBeds <= 0 ||
    noOfBeds % 1 !== 0 ||
    noOfBeds.toString().indexOf('.') != -1
  ) {
    alert('Please enter a valid number for "No of Beds"');
    return false;
  }
  if (
    isNaN(noOfBathrooms) ||
    noOfBathrooms <= 0 ||
    noOfBathrooms % 1 !== 0 ||
    noOfBathrooms.toString().indexOf('.') != -1
  ) {
    alert('Please enter a valid number for "No of Bathrooms"');
    return false;
  }
  if (
    isNaN(noOfGuests) ||
    noOfGuests <= 0 ||
    noOfGuests % 1 !== 0 ||
    noOfGuests.toString().indexOf('.') != -1
  ) {
    alert('Please enter a valid number for "No of Guests"');
    return false;
  }
  if (isNaN(price) || price <= 0 || price.toString().indexOf('.') != -1) {
    alert('Please enter a valid number for "Price per Night"');
    return false;
  }
}
