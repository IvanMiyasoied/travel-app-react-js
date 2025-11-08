import { useMemo, useState } from "react";
import { useApiRequestContext } from "../../store/useApiRequest";
import {
  getHotelsApiTwice,
  getSearchCountry,
  getSearchGeoTwice,
} from "../../api/my-api";
import "./style.css";

const types = ["hotel", "city", "country"];

const OneSearchResult = ({ elem, onSelected }) => {
  const img = useMemo(() => {
    if (elem.type === "country") return elem.flag;
    if (elem.type === "city") return "./icons/point.png";
    if (elem.type === "hotel") return "./icons/bed.png";
  }, [elem]);

  return (
    <div className="saerch-c" onClick={() => onSelected(elem)}>
      <div className="saerch-c-icon">
        <img className="saerch-icon" src={img} />
      </div>
      <p className="saerch-name">{elem.name}</p>
    </div>
  );
};

function Form() {
  // const store = useApiRequestContext();
  const {countryData, createError, onSearchCountryHotels, onSearchCityHotels, onSearchOneHotel, clearCurrentSearch, isLoadingPrice} = useApiRequestContext();
  const [datas, setDatas] = useState([]);
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const onHandlerSearch = async (e) => {
    const v = e.target.value;
    setText(v);
    if (v.trim() === "") {
      setDatas(countryData);
    }
  };

  const onSearch = async () => {
      const response = await getSearchGeoTwice();
      if (!response.ok) return createError(response);
      setDatas(Object.values(response.data));
  }

  const onFocusHandler = () => {
    if (text.trim() === "") setDatas(countryData);
    setIsOpen(true);
  };
  const onSelected = (data) => {
    setIsOpen(false);
    switch (data.type) {
      case "country": return onSearchCountryHotels(data.id);
      case "city" : return onSearchCityHotels(data.countryId, data.id);
      case "hotel" : return onSearchOneHotel(data.countryId, data.cityId, data.id);
    }
  };

  const clearSearch = () => {
    setText("");
    setDatas([]);
    setIsOpen(false);
  };
  const isExisttext = text.trim() !== "";
  const onHiddenList = () => {
    if(isExisttext) return
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  }
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
     onSearch()
    }
  };
  const onBreakSearch = () => {
    clearCurrentSearch()
  }


  return (
    <div className="main-form">
      <div className="main-form-content">
        {isExisttext && (
          <div className="main-form-close" onClick={clearSearch}>
            x
          </div>
        )}
        <input
          onBlur={onHiddenList}
          onFocus={onFocusHandler}
          type="text"
          onKeyDown={handleKeyDown}
          onChange={onHandlerSearch}
          value={text}
          className="main-input"
        />
        {isOpen && (
          <div className="main-lists">
            {datas.map((elem) => (
              <OneSearchResult
                elem={elem}
                key={elem.id}
                onSelected={onSelected}
              />
            ))}
          </div>
        )}
      </div>
      {isLoadingPrice ? <button onClick={onBreakSearch} className="main-button main-button-break">
        Зупинити пошук
      </button>
     : <button disabled={!isExisttext} onClick={onSearch} className="main-button">
        Знайти
      </button>}
    </div>
  );
}

export default Form;
