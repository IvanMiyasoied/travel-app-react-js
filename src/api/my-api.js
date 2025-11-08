import { getCountries, getHotel, getHotels, getPrice, getSearchPrices, searchGeo, startSearchPrices, stopSearchPrices } from "./api";

const responseError = { ok: false, text: "Text Error", status: 404 };
const responseGood = { ok: true, data: [], status: 200 };

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
    return { ok: true, data, status: response.status }
  } catch (e) {
    return { ok: false, status: e.code, text: e.message };
  }
};

const getSearchGeo = async (text) => {
  try {
    const response = await searchGeo(text);
    const data = await response.json();
    if (response.ok == false) return { ok: false, status: response.status, text: data.message };
    return { ok: true, data, status: response.status }
  } catch (e) {
    return { ok: false, status: e.code, text: e.message };
  }
};


const getStartSearchPrices = async (countryID) => {
  try {
    const response = await startSearchPrices(countryID)
    const data = await response.json();
    if (response.ok == false) return { ok: false, status: response.status, text: data.message };
    return { ok: true, data, status: response.status }
  } catch (e) {
    return { ok: false, status: e.code, text: e.message };
  }
}

const getSearchPricesApi = async (token) => {
  try {
    const response = await getSearchPrices(token)
    const data = await response.json();
    if (response.ok == false) return { ok: false, status: response.status, text: data.message };
    return { ok: true, data, status: response.status }
  } catch (e) {
    return { ok: false, status: e.code, text: e.message };
  }
}
const getHotelApi = async (hotelID) => {
  try {
    const response = await getHotel(hotelID)
    const data = await response.json();
    if (response.ok == false) return { ok: false, status: response.status, text: data.message };
    return { ok: true, data, status: response.status }
  } catch (e) {
    return { ok: false, status: e.code, text: e.message };
  }
}
const getHotelsApi = async (countryID) => {
  try {
    const response = await getHotels(countryID)
    const data = await response.json();
    if (response.ok == false) return { ok: false, status: response.status, text: data.message };
    return { ok: true, data, status: response.status }
  } catch (e) {
    return { ok: false, status: e.code, text: e.message };
  }
}
const getPriceApi = async (priceID) => {
  try {
    const response = await getPrice(priceID)
    const data = await response.json();
    if (response.ok == false) return { ok: false, status: response.status, text: data.message };
    return { ok: true, data, status: response.status }
  } catch (e) {
    return { ok: false, status: e.code, text: e.message };
  }
}



export const getHotelsApiTwice = getPromises(getHotelsApi);
export const getSearchPricesApiTwice = getPromises(getSearchPricesApi);
export const getStartSearchPricesTwice = getPromises(getStartSearchPrices);
export const getCountryForCountriesTwice = getPromises(getCountryForCountries);
export const getHotelApiTwice = getPromises(getHotelApi);
export const getSearchGeoTwice = getPromises(getSearchGeo)
export const getPriceApiTwice = getPromises(getPriceApi)


const blockSearchPrices = {}
export const onBlockSearchPrices = () => {
  for(const key in blockSearchPrices) {
    blockSearchPrices[key] = true
  }
};
export const onResetSearchPrices = (timeRequest) => blockSearchPrices[timeRequest] = false;
export const onDeleteRequest = (timeRequest) => delete blockSearchPrices[timeRequest];

let currentSearchToken = null;
const onSaveNewSearchToken = (token) => currentSearchToken = token;
const onClearSearchToken = () => currentSearchToken = null;;


export const stopSearchPricesApi = async () => {
  try {
    if(!currentSearchToken) return { ok: true };
    const response = await stopSearchPrices(currentSearchToken)
    const data = await response.json();
    onClearSearchToken();
    if (response.ok == false) return { ok: false, status: response.status, text: data.message };
    return { ok: true, data, status: response.status }
  } catch (e) {
    return { ok: false, status: e.code, text: e.message };
  }
}

export const getSearchCountry = async (countryID) => {
  try {
    const timeRequest = Date.now();
    onResetSearchPrices(timeRequest)
    setTimeout(() => {
      onDeleteRequest(timeRequest)
    }, 120000); // блокування запиту через 120 секунд
    const response = await getStartSearchPricesTwice(countryID)
    if (!response.ok) return { ok: false, status: response.status, text: response.text };
    const token = response.data.token;
    onSaveNewSearchToken(token)
    const time = new Date(response.data.waitUntil)
    const now = Date.now();
    const timeWeit = time - now;
    await waitPromise(timeWeit);
    if (blockSearchPrices[timeRequest]) {
      onClearSearchToken();
      return { ok: false, status: 408, text: 'Запит скасовано користувачем' };
    }
    const responseData = await getSearchPricesApiTwice(token)
    const keys = Object.keys(responseData.data.prices);
    onClearSearchToken();
    if (keys.length === 0) return { ok: false, status: 404, text: 'За вашим запитом турів не знайдено' };
    return responseData;
  } catch (e) {
    return { ok: false, status: e.code, text: e.message };
  }
}