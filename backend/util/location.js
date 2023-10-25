const axios = require('axios');
const HttpError = require('../models/http-error');

async function getCoordsForAddress(address) {
  const formattedAddress = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search/?q=${formattedAddress}&format=json`;

  try {
    const response = await axios.get(url);

    if (!response.data || response.data.length === 0) {
      const error = new HttpError(
        'Could not find location for the specified address.',
        422
      );
      throw error;
    }

    const coordinates = {
      lat: parseFloat(response.data[0].lat),
      lng: parseFloat(response.data[0].lon),
    };

    return coordinates;
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data.error
      : 'Something went wrong, please try again later.';
    throw new HttpError(errorMessage, error.response ? error.response.status : 500);
  }
}

module.exports = getCoordsForAddress;
