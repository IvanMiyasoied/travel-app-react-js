import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useApiRequestContext } from "../src/store/useApiRequest";
import "../src/stylePages/styleCurrentHotel.css";
import { getPrice } from "../src/api/api";
import { getHotelApiTwice, getPriceApiTwice } from "../src/api/my-api";

const hotel = {
  id: 7953,
  name: "Marlin Inn Azur Resort",
  img: "https://newimg.otpusk.com/2/400x300/00/03/97/88/3978846.webp",
  cityId: 712,
  cityName: "Хургада",
  countryId: "43",
  countryName: "Єгипет",
};
const price = {
  id: "84092818-f07e-40e0-96ef-879a85ac791f", // priceId
  amount: 2341,
  currency: "usd",
  startDate: "2025-11-09",
  endDate: "2025-11-14",
  hotelID: "7953",
};

const elemDefoult = { ...hotel, ...price, priceId: price.id };

const elemTest = {
  id: 7953,
  name: "Marlin Inn Azur Resort",
  img: "https://newimg.otpusk.com/2/400x300/00/03/97/88/3978846.webp",
  cityId: 712,
  cityName: "Хургада",
  countryId: "43",
  countryName: "Єгипет",
  description:
    "Готель розташований на березі моря. Готель заснований у 1990 році, остання реновація проведена у 2016 році. Затишна зелена територія, комфортабельні номери. Поруч із готелем знаходиться гарна дискотека. Підійде для молоді та сімей з дітьми.",
  services: {
    wifi: "yes",
    aquapark: "none",
    tennis_court: "yes",
    laundry: "yes",
    parking: "yes",
  },
};

const servicesList = [
  { key: "wifi", label: "WI-FI", icon: "./icons/wifi.png" },
  { key: "aquapark", label: "Басейн", icon: "./icons/aquapark.png" },
  { key: "food", label: "Харчування", icon: "./icons/food.png" },
  { key: "parking", label: "Парковка", icon: "./icons/parking.png" },
  { key: "laundry", label: "Пральня", icon: "./icons/laundry.png" },
  {
    key: "tennis_court",
    label: "Тенісний корт",
    icon: "./icons/tennis_court.png",
  },
];

export const CurrentHotel = () => {
  const { id } = useParams();
  const { createError } = useApiRequestContext();
  const [elem, setElem] = useState(null);
  const [priceHotel, setPriceHotel] = useState(null);
  const [error, setError] = useState(null);


  const onGetHotelApiTwiceCurrentHotel = async () => {
    const response = await getHotelApiTwice(+id);
    if (!response.ok) return setError(response.text);

    const data = response.data;
    setElem(data);
  };

  const getPriceData = async () => {
    const response = await getPriceApiTwice(elem.id);
    if (!response.ok) return createError(response);
    const data = response.data;
    setPriceHotel(data);
  };

  useEffect(() => {
    if (!elem) {
      onGetHotelApiTwiceCurrentHotel();
    }
  }, [id, elem]);

  if (error) {
    return <div className="currentHotel-loading">{error}</div>;
  }
  if (!elem) {
    return <div className="currentHotel-loading">Loading...</div>;
  }

  return (
    <div className="currentHotel-content">
      <h2 className="currentHotel-name">{elem.name}</h2>
      <div className="currentHotel-name-icon-content">
        <div className="currentHotel-name-icon-c">
          <img className="currentHotel-icon" src="./icons/point.png" alt="" />
          <p className="currentHotel-text">{elem.countryName}</p>
        </div>
        <div className="currentHotel-name-icon-c">
          <img className="currentHotel-icon" src="./icons/office.png" alt="" />
          <p className="currentHotel-city">{elem.cityName}</p>
        </div>
      </div>
      <img className="currentHotel-img" src={elem.img} alt="" />
      <h2 className="currentHotel-desc-title">Опис</h2>
      <p className="currentHotel-desc-text">
        {elem.description || "Опис ще не додали"}{" "}
      </p>
      <h2 className="currentHotel-desc-title">Сервіс</h2>

      <div className="currentHotel-name-icon-content currentHotel-name-icon-content--services">
        {servicesList.map(({ key, label, icon }) => {
          if (elem.services?.[key] === "yes") {
            return (
              <div className="currentHotel-name-icon-c" key={key}>
                <img className="currentHotel-icon" src={icon} alt="" />
                <p className="currentHotel-text">{label}</p>
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="currentHotel-line"></div>
      {priceHotel ? (
        <>
          <div className="currentHotel-name-icon-c">
            <img
              className="currentHotel-icon"
              src="./icons/calendar.png"
              alt=""
            />
            <p className="currentHotel-text">{priceHotel.startDate.replace(/-/g, '.')}</p>
          </div>

          <div className="currentHotel-price-block">
            <p className="currentHotel-price">
              {priceHotel.amount} {priceHotel.currency}
            </p>
          </div>
        </>
      ) : (
        <button className="currentHotel-booking-btn" onClick={getPriceData}>
          Відкрити ціну
        </button>
      )}
    </div>
  );
};
