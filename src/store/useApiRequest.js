import {
  useCallback,
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from "react";
import { getCountryForCountriesTwice, getHotelApiTwice, getHotelsApiTwice, getSearchCountry } from "../api/my-api";

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


  const r = {
    "id": 7898,
    "name": "Saphir Hotel & Villas",
    "img": "https://newimg.otpusk.com/2/400x300/00/04/37/33/4373386.webp",
    "cityId": 953,
    "cityName": "Аланія",
    "countryId": "115",
    "countryName": "Туреччина",
    "description": "Готель розташований на березі моря. Готель заснований у 1990 році, остання реновація проведена у 2016 році. Затишна зелена територія, комфортабельні номери. Поруч із готелем знаходиться гарна дискотека. Підійде для молоді та сімей з дітьми.",
    "services": {
        "wifi": "yes",
        "aquapark": "none",
        "tennis_court": "yes",
        "laundry": "yes",
        "parking": "yes"
    }
}

  const onGetHotelApiTwice = async (countryID, hotelID) => {
    // cesh
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
    // if (!response.ok) createError(response);
    // else {
    //   const data = Object.values(response.data)
    //   setCountriesDataHotel((prev) => ({
    //     ...prev,
    //     [countryID]: data
    //   }));
    // }
  };

 const searchResults = useMemo(() => {
   if(Object.keys(countriesDataHotel).length === 0) return [];
   const hotels = countriesDataHotel[countryID];
   console.log(countriesDataHotel)
   console.log(countryID, cityID, hotelID)
   if(!hotels) return [];
   if(cityID) return hotels.filter((el => cityID === el.cityId))
   return hotels
  }, [cityID, countriesDataHotel, countryID, hotelID])



  const onSearchCountryHotels = async (countryID) => {
    setIsLoading(true);
    setCityID(null)
    setCountryID(countryID)
    await onGetCountryResultHotels(countryID);
    await onGetSearchPrices(countryID);
    setIsLoading(false);

  }
  const onSearchCityHotels = async (countryID, cityID) => {
    onSearchCountryHotels(countryID)
    setCityID(cityID)
  }
  const onSearchOneHotel = async (countryID, cityID, hotelID) => {
    setIsLoading(true);
    setCountryID(countryID)
    setHotelID(hotelID)
    setCityID(cityID)
    await onGetHotelApiTwice(countryID, hotelID)
    await onGetSearchPrices(countryID);
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
    setError({ text, status, isOpen : true });
    setTimeout(() => {
      setError(error => ({...error, isOpen : false}));
      setTimeout(() => {
        setError(error => ({...error, text : ''}));
      }, 1700);
    }, 5000);
  }, []);


  const onGetSearchPrices = async (countryID) => {
    const hotelCountry = searchPrices[countryID];
    if(hotelCountry) {
      if(!hotelID) return;
      const isExist = hotelCountry.some(el => el.id == hotelID);
      if(isExist) return;
    }

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
    onSearchCityHotels,
    onSearchOneHotel,
    searchResults,
    searchPrices
  };
};

export const useApiRequestContext = () => useContext(ApiRequestContext);
