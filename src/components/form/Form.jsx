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
  const store = useApiRequestContext();
  const [datas, setDatas] = useState([]);
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const onHandlerSearch = async (e) => {
    const v = e.target.value;
    setText(v);
    if (v.trim()) {
      const response = await getSearchGeoTwice();
      if (!response.ok) return store.createError(response);
      setDatas(Object.values(response.data));
    }
  };

  // const onGetCountryResult = async (data) => {
  //   // store.setIsLoading(true);
  //   const response = await getSearchCountry(data.id);
  //   if (!response.ok) store.createError(response);
  //   else {
  //   }
  //   console.log(response);
  //   // store.setIsLoading(false);
  // };
  // const onGetCountryResultHotels = async (data) => {
  //   store.setIsLoading(true);
  //   const response = await getHotelsApiTwice(data.id);
  //   if (!response.ok) store.createError(response);
  //   else {
  //   }
  //   console.log(response);
  //   store.setIsLoading(false);
  // };

  const onFocusHandler = () => {
    if (text.trim() === "") setDatas(store.countryData);
    setIsOpen(true);
  };
  const onSelected = (data) => {
    setIsOpen(false);

    switch (data.type) {
      case "country":
        return store.onSearchCountryHotels(data.id);
      //  onGetCountryResult(data);
      // create 2 function  hotel city
    }
  };

  const clearSearch = () => {
    setText("");
    setDatas([]);
    setIsOpen(false);
  };

  // console.log(store.countryData);

  // const onHandlerSearch = async () => {
  //   const res = await getSearchGeoTwice();
  //   console.log(res);
  // };

  return (
    <form className="main-form">
      <div className="main-form-content">
        {/* onBlur={() => setIsOpen(false)} */}
        {text.trim() !== "" && (
          <div className="main-form-close" onClick={clearSearch}>
            x
          </div>
        )}
        <input
          onFocus={onFocusHandler}
          type="text"
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
    </form>
  );
}

export default Form;
