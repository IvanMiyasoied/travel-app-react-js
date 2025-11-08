import { useApiRequestContext } from "../../store/useApiRequest";
import { Hotel } from "./Hotel";
import "./style.css";
export const Hotels = () => {
  const { searchResults, searchPrices, isWasRequest, isLoading, countryData } = useApiRequestContext();

  if (searchResults.length === 0 && isWasRequest && !isLoading)
    return (
      <div className="hotel-error-content">
        За вашим запитом не має результатів
      </div>
    );
  return (
    <div className="hotels-content">
      {searchResults.map((elem) => (
        <Hotel key={elem.id} elem={elem} searchPrices={searchPrices} country={countryData.find(({id}) => id == elem.countryId) } />
      ))}
    </div>
  );
};
