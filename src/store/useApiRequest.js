import {
  useCallback,
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from "react";
import { getCountryForCountriesTwice, getHotelsApiTwice, getSearchCountry } from "../api/my-api";

export const ApiRequestContext = createContext();

const time24H = 24 * 60 * 60 * 1000;

const getCeshDataFromLS = (key) => {
  const countryDataLS = localStorage.getItem(key);
  return countryDataLS ? JSON.parse(countryDataLS) : { data: [], timestamp: 0 };
};

export const useApiRequest = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countryData, setCountryData] = useState(
    getCeshDataFromLS("countryData")
  );


  const [countriesDataHotel, setCountriesDataHotel] = useState({});
  const [searchPrices, getSearchPrices] = useState({});

  const [searchResults, setSearchResults] = useState([]);

  const onGetCountryResultHotels = async (countryID) => {
    // if (countriesDataHotel[countryID]) return;

    const response = await getHotelsApiTwice(countryID);
    if (!response.ok) createError(response);
    else {
      const data = Object.values(response.data)
      setCountriesDataHotel((prev) => ({
        ...prev,
        [countryID]: data
      }));
      setSearchResults(data)
      // onGetSearchPrices(countryID);
    }

  };

  const onSearchCountryHotels = async (countryID) => {
    setIsLoading(true);
    if (!countriesDataHotel[countryID]) await onGetCountryResultHotels(countryID);
    if (!searchPrices[countryID]) await onGetSearchPrices(countryID);
    setIsLoading(false);
  }


  const getCountryData = useCallback(async () => {
    const response = await getCountryForCountriesTwice();
    if (response.ok == false)
      return createError({ text: response.text, status: response.status });

    const data = response.data;
    const datas = { data: data, timestamp: Date.now() + time24H };
    localStorage.setItem("countryData", JSON.stringify(datas));
    setCountryData(datas);
  }, []);

  const fetchAllDatas = useCallback(async () => {
    const now = Date.now();
    const isGetCountry = now > countryData.timestamp;
    setIsLoading(true);
    if (isGetCountry) await getCountryData();
    // if(isGetCountry) await getCountryData();
    // if(isGetCountry) await getCountryData();
    setIsLoading(false);
  }, [countryData]);

  useEffect(() => {
    // get country data from api
    fetchAllDatas();
  }, []);

  const createError = useCallback(({ text, status }) => {
    setError({ text, status });
    setTimeout(() => {
      setError(null);
    }, 5000);
  }, []);


  const onGetSearchPrices = async (countryID) => {
    // if(searchPrices[countryID]) return;
    const response = await getSearchCountry(countryID);
    if (!response.ok) createError(response);
    else {
      getSearchPrices((prev) => ({
        ...prev,
        [countryID]: Object
          .values(response.data.prices)
          .reduce((acc, item) => {
            acc[item.hotelID] = item;
            return acc;
        }, {})
      }));
    }
  };



  const countryDataMemo = useMemo(() => Object.values(countryData.data).map(el => ({ ...el, type: 'country' })), [countryData])

  return {
    createError,
    isLoading,
    error,
    countryData: countryDataMemo,
    setIsLoading,
    onSearchCountryHotels,
    searchResults,
    searchPrices
  };
};

export const useApiRequestContext = () => useContext(ApiRequestContext);
