import { getCountries, searchGeo } from "./api";

const responseError = { ok: false, text: "Text Error", status: 404 };
const responseGood = { ok: true, data: [], status: 200 };


function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    const context = this; 
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}


const waitPromise = async () =>
  await new Promise((resolve) => setTimeout(resolve, 1000));

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


export const getCountryForCountriesTwice = getPromises(getCountryForCountries);
export const getSearchGeoTwice = getPromises(getSearchGeo)//, 500)




