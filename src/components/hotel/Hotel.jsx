import { useMemo } from "react";
import { Link } from "react-router-dom";

export const Hotel = ({ elem, searchPrices, country }) => {
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
        <img className="hotel-flag" src={country?.flag} alt="pic" />
        <p className="hotel-country">{elem.countryName},</p>
        <p className="hotel-city">{elem.cityName}</p>
      </div>
      <p className="hotel-start-tur">Cтарт тура</p>
      <p className="hotel-date">{priceInfo.startDate?.replace(/-/g, '.')}</p>
      <p className="hotel-price">{priceInfo.amount} {priceInfo.currency}</p>
      <Link to={'hotel/' + elem.id} className="hotel-open-price">Дивитися детальніше</Link>
    </div>
  );
};

