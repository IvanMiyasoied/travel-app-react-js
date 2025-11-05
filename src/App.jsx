import "./App.css";
import ErrorPopup from "./components/errors/ErrorPopup";
import Form from "./components/form/Form";
import { Hotels } from "./components/hotel/Hotels";
import Loading from "./components/loading/Loading";
import { ApiRequestContext, useApiRequest } from "./store/useApiRequest";

function App() {
  const store = useApiRequest();
  return (
    <ApiRequestContext.Provider value={store}>
      <Form />
      <Hotels/>
      {store.isLoading && <Loading/>}
      <ErrorPopup text={store.error?.text} isOpen={!!store.error}/>
    </ApiRequestContext.Provider>
  );
}

export default App;
