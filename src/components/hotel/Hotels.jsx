import { useApiRequestContext } from "../../store/useApiRequest"
import { Hotel } from "./Hotel";
import "./style.css";
export const Hotels = () => {
    const {searchResults, searchPrices} = useApiRequestContext();
    // console.log(searchResults);  
    // console.log(searchPrices, 'from hotels');  
    if(searchResults.length === 0) return <div className="hotel-error-content">Hotel with this ID was not found.</div>
  return (
    <div className="hotels-content">
        {searchResults.map((elem) => <Hotel key={elem.id} elem={elem} searchPrices={searchPrices} />)}
    </div>
  )
}
