import { useEffect, useMemo, useState } from "react";
import { getCountries } from "../../api/api";
import { useApiRequestContext } from "../../store/useApiRequest";
import { getSearchCountry, getSearchGeoTwice, getStartSearchPricesTwice } from "../../api/my-api";
import './style.css'

const types = ["hotel", "city", "country"]


const OneSearchResult = ({elem, onSelected}) => {

  const img = useMemo(() => {
    if(elem.type === 'country') return elem.flag;
    if(elem.type === 'city') return '' /// add icon 
    if(elem.type === 'hotel') return // add icon
  }, [elem])

  return <div onClick={() => onSelected(elem)}>  
  <img src={img} />
  <p>{elem.name}</p>
  </div>
}



function Form() {
  const store = useApiRequestContext();
  const [datas, setDatas] = useState([]);
  const [text, setText] = useState('');
  const [isOpen, setIsOpen] = useState(false);


  const onHandlerSearch = async (e) => {
    const v = e.target.value;
    setText(v)
    if(v.trim()) {
      const response = await getSearchGeoTwice();
      console.log(response)
      if(!response.ok) return store.createError(response)
      setDatas(Object.values(response.data))

    }

  }


  const onGetCountryResult = async (data) => {
    const r = await getSearchCountry(data.id)

    console.log(r, data)
  }


  const onFocusHandler = () => {
    if(text.trim() === '') setDatas(store.countryData);
    setIsOpen(true)
  }
  const onSelected = (data) => {
    setIsOpen(false)

    switch(data.type){
      case 'country' : return onGetCountryResult(data)
      // create 2 function  hotel city
    }

  }


  console.log(store.countryData)

  // const onHandlerSearch = async () => {
  //   const res = await getSearchGeoTwice();
  //   console.log(res);
  // };

  return (
    <form className="main-form">
      <div className="main-form-content">
      {/* onBlur={() => setIsOpen(false)} */}
      <input onFocus={onFocusHandler}  type="text" onChange={onHandlerSearch} value={text} className="main-input" />
      {isOpen && <div className="main-lists">
        {datas.map((elem) => <OneSearchResult elem={elem}  key={elem.id} onSelected={onSelected}/> )}
        </div>}
      </div>
    </form>
  );
}

export default Form;
