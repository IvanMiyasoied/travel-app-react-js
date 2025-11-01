import {
  useCallback,
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from "react";
import { getCountryForCountriesTwice } from "../api/my-api";

export const ApiRequestContext = createContext();

const time24H = 24 * 60 * 60 * 1000;

const getCeshDataFromLS = (key) => {
  const countryDataLS = localStorage.getItem(key);
  return countryDataLS ? JSON.parse(countryDataLS) : { data: [], timestamp: 0 };
};

export const useApiRequest = () => {
  const [isLoading, seyIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countryData, setCountryData] = useState(
    getCeshDataFromLS("countryData")
  );

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

    seyIsLoading(true);
    if (isGetCountry) await getCountryData();
    // if(isGetCountry) await getCountryData();
    // if(isGetCountry) await getCountryData();
    seyIsLoading(false);
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

  

  const countryDataMemo = useMemo(() => Object.values(countryData.data).map(el => ({...el, type : 'country'})), [countryData])

  return {
    createError,
    isLoading,
    error,
    countryData: countryDataMemo,
  };
};

export const useApiRequestContext = () => useContext(ApiRequestContext);
