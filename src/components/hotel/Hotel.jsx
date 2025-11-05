import { useMemo } from "react";

export const Hotel = ({ elem, searchPrices }) => {
  const priceInfo = useMemo(() => {
    const country = searchPrices[elem.countryId];
    if(!country) return {};
    return country[elem.id] || {};
  }, [elem, searchPrices]);
    
  [elem.id]
  return (
    <div className="hotel-content">
      <img className="hotel-img" src={elem.img} alt="" />
      <h2 className="hotel-name">{elem.name}</h2>
      <div className="hotel-country-city">
        <img className="hotel-flag" src="" alt="" />
        <p className="hotel-country">{elem.countryName}</p>
        <p className="hotel-city">{elem.cityName}</p>
      </div>
      <p className="hotel-start-tur">старт тура</p>
      <p className="hotel-date">{priceInfo.startDate}</p>
      <p className="hotel-price">{priceInfo.amount} {priceInfo.currency}</p>
      <a className="hotel-open-price">Відкрити ціну</a>
    </div>
  );
};


[
    {
        "id": 7953,
        // "name": "Marlin Inn Azur Resort",
        // "img": "https://newimg.otpusk.com/2/400x300/00/03/97/88/3978846.webp",
        "cityId": 712,
        // "cityName": "Хургада",
        "countryId": "43",
        // "countryName": "Єгипет"
    },
    {
        "id": 18183,
        "name": "Albatros Makadi Resort",
        "img": "https://newimg.otpusk.com/2/400x300/00/04/88/41/4884132.webp",
        "cityId": 1262,
        "cityName": "Макаді Бей",
        "countryId": "43",
        "countryName": "Єгипет"
    },
    {
        "id": 84183,
        "name": "Protels Beach Club & SPA",
        "img": "https://newimg.otpusk.com/2/400x300/00/03/95/62/3956278.webp",
        "cityId": 1247,
        "cityName": "Марса Алам",
        "countryId": "43",
        "countryName": "Єгипет"
    }
]