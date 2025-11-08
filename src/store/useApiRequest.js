import {
  useCallback,
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from "react";
import { getCountryForCountriesTwice, getHotelApiTwice, getHotelsApiTwice, getSearchCountry, onBlockSearchPrices, stopSearchPricesApi } from "../api/my-api";

export const ApiRequestContext = createContext();

const time24H = 24 * 60 * 60 * 1000;

const getCeshDataFromLS = (key) => {
  const countryDataLS = localStorage.getItem(key);
  return countryDataLS ? JSON.parse(countryDataLS) : { data: [], timestamp: 0 };
};

export const useApiRequest = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({text : '', isOpen : false, status : 0});
  const [countryData, setCountryData] = useState(
    getCeshDataFromLS("countryData")
  );
  // was there a request
  
  const [isWasRequest, setIsWasRequest] = useState(false);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [cityID, setCityID] = useState(null)
  const [countryID, setCountryID] = useState(null)
  const [hotelID, setHotelID] = useState(null)

  const [countriesDataHotel, setCountriesDataHotel] = useState({});
  const [searchPrices, getSearchPrices] = useState({});

  const onGetCountryResultHotels = async (countryID) => {
    if (countriesDataHotel[countryID]) return;
    const response = await getHotelsApiTwice(countryID);
    if (!response.ok) createError(response);
    else {
      const data = Object.values(response.data)
      setCountriesDataHotel((prev) => ({
        ...prev,
        [countryID]: data
      }));
    }
  };
 

  const onGetHotelApiTwice = async (countryID, hotelID) => {
    const hotelCountry = countriesDataHotel[countryID];
    if(hotelCountry) {
      const isExist = hotelCountry.some(el => el.id == hotelID);
      if(isExist) return;
    }

    const response = await getHotelApiTwice(hotelID);
    if (!response.ok) createError(response);
    else {
      const data = response.data;

      setCountriesDataHotel((prev) => {
        const hotels = prev[countryID] || [];
        const existIndex = hotels.findIndex(el => hotelID === el.id);
        if(existIndex == -1) hotels.push(data);
        else hotels[existIndex] = data; 
        return {
          ...prev,
          [countryID]: hotels
        }
      });
    }
  };

 const searchResults = useMemo(() => {
   if(Object.keys(countriesDataHotel).length === 0) return [];
   const hotels = countriesDataHotel[countryID];

   if(!hotels) return [];
   if(cityID) return hotels.filter((el => cityID === el.cityId))
   return hotels
  }, [cityID, countriesDataHotel, countryID, hotelID])



  const onSearchCountryHotels = async (countryID, cityID) => {
    setIsLoading(true);
    setCityID(null)
    setCountryID(countryID)
    // setIsWasRequest(false)
    setIsWasRequest(true)
    await onGetCountryResultHotels(countryID);
    await onGetSearchPrices(countryID, cityID);
    setIsLoading(false);

  }
  const onSearchCityHotels = async (countryID, cityID) => {
    onSearchCountryHotels(countryID, cityID)
    setCityID(cityID)
  }
  const onSearchOneHotel = async (countryID, cityID, hotelID) => {
    setIsLoading(true);
    setCountryID(countryID)
    setHotelID(hotelID)
    setCityID(cityID)
    setIsWasRequest(true)
    await onGetHotelApiTwice(countryID, hotelID)
    await onGetSearchPrices(countryID, cityID, hotelID);
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
    setIsLoading(false);
  }, [countryData]);

  useEffect(() => {
    fetchAllDatas();
  }, []);

  const createError = useCallback(({ text, status }) => {
    setError({ text, status, isOpen : true });
    setTimeout(() => {
      setError(error => ({...error, isOpen : false}));
    }, 5000);
  }, []);

  const onGetSearchPrices = async (countryID, cityID, hotelID) => {
    const hotelCountry = searchPrices[countryID];
    if(hotelCountry) return
    setIsLoadingPrice(true)
    const response = await getSearchCountry(countryID);
    if(response.ok == false && response.status === 408) return;
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
    setIsLoadingPrice(false)
  };
  const countryDataMemo = useMemo(() => Object.values(countryData.data).map(el => ({ ...el, type: 'country' })), [countryData])

  const clearCurrentSearch = () => {
    stopSearchPricesApi()
    onBlockSearchPrices()
    setCityID(null)
    setCountryID(null)
    setHotelID(null)
    setIsWasRequest(false)
    setIsLoadingPrice(false)
    setIsLoading(false)
  }
  return {
    createError,
    isLoading,
    error,
    countryData: countryDataMemo,
    setIsLoading,
    onSearchCountryHotels,
    onSearchCityHotels,
    onSearchOneHotel,
    clearCurrentSearch,
    searchResults,
    searchPrices,
    isWasRequest,
    isLoadingPrice,
    countriesDataHotel
  };
};

export const useApiRequestContext = () => useContext(ApiRequestContext);
