import { getCountries, getHotel, getHotels, getSearchPrices, searchGeo, startSearchPrices } from "./api";

const responseError = { ok: false, text: "Text Error", status: 404 };
const responseGood = { ok: true, data: [], status: 200 };

//  асинхронный debounce
function debounceAsync(func, delay) {
  let timeoutId;
  return function(...args) {
    const context = this;
    return new Promise((resolve, reject) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          const result = await func.apply(context, args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}



const waitPromise = async (time = 1000) =>
  await new Promise((resolve) => setTimeout(resolve, time));



const getPromises = (promise) => async (data) => {
  const response1 = await promise(data);
  if (response1.ok) return response1;
  waitPromise();
  const response2 = await promise(data);
  return response2;
};

const getCountryForCountries = async () => {
  try {
    const response = await getCountries();
    const data = await response.json();
    if (response.ok == false) return { ok: false, status: response.status, text: data.message };
    return {ok : true, data, status : response.status}
  } catch (e) {
    return { ok: false, status: e.code, text: e.message };
  }
};

const getSearchGeo = async (text) => {
  try {
    const response = await searchGeo(text);
    const data = await response.json();
    if (response.ok == false) return { ok: false, status: response.status, text: data.message };
    return {ok : true, data, status : response.status}
  } catch (e) {
    return { ok: false, status: e.code, text: e.message };
  }
};


const getStartSearchPrices = async (countryID) => {
  try {
    const response = await startSearchPrices(countryID)
    const data = await response.json();
    if (response.ok == false) return { ok: false, status: response.status, text: data.message };
    return {ok : true, data, status : response.status}
  } catch (e) {
    return { ok: false, status: e.code, text: e.message };
  }
}

const getSearchPricesApi = async (token) => {
  try {
    const response = await getSearchPrices(token)
    const data = await response.json();
    if (response.ok == false) return { ok: false, status: response.status, text: data.message };
    return {ok : true, data, status : response.status}
  } catch (e) {
    return { ok: false, status: e.code, text: e.message };
  }
}
const getHotelApi = async (hotelID) => {
  try {
    const response = await getHotel(hotelID)
    const data = await response.json();
    if (response.ok == false) return { ok: false, status: response.status, text: data.message };
    return {ok : true, data, status : response.status}
  } catch (e) {
    return { ok: false, status: e.code, text: e.message };
  }
}
const getHotelsApi = async (countryID) => {
  try {
    const response = await getHotels(countryID)
    const data = await response.json();
    if (response.ok == false) return { ok: false, status: response.status, text: data.message };
    return {ok : true, data, status : response.status}
  } catch (e) {
    return { ok: false, status: e.code, text: e.message };
  }
}



export const getHotelsApiTwice = getPromises(getHotelsApi);
export const getSearchPricesApiTwice = getPromises(getSearchPricesApi);
export const getStartSearchPricesTwice = getPromises(getStartSearchPrices);
export const getCountryForCountriesTwice = getPromises(getCountryForCountries);
export const getHotelApiTwice = getPromises(getHotelApi);
export const getSearchGeoTwice = getPromises(getSearchGeo)//, 500)
// export const getSearchGeoTwice = debounce(getPromises(getSearchGeo), 500)


export const getSearchCountry = async (countryID) => {
  try {
    const response = await getStartSearchPricesTwice(countryID)
    if(!response.ok) return { ok: false, status: response.status, text: response.text };
    const token = response.data.token;

    const time = new Date(response.data.waitUntil)
    const now = Date.now();
    const timeWeit = time - now;
    await waitPromise(timeWeit);
    const responseData = await getSearchPricesApiTwice(token)
    const keys = Object.keys(responseData.data.prices);
    if(keys.length === 0) return { ok: false, status: 404, text: 'За вашим запитом турів не знайдено'};
    return responseData;
  } catch (e) {
    return { ok: false, status: e.code, text: e.message };
  }
}


// {
//   "token": "3d0b65a0-5951-4364-b084-1e938064905a",
//   "waitUntil": "2025-11-01T11:02:40.002Z"
// }






