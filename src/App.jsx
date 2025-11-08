import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ErrorPopup from "./components/errors/ErrorPopup";
import Loading from "./components/loading/Loading";
import { ApiRequestContext, useApiRequest } from "./store/useApiRequest";
import { Main } from "../pages/Main";
import { CurrentHotel } from "../pages/CurrentHotel";

function App() {
  const store = useApiRequest();
  return (
    <ApiRequestContext.Provider value={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/hotel/:id" element={<CurrentHotel />} />
        </Routes>
      </Router>

      {store.isLoading && <Loading />}
      <ErrorPopup text={store.error?.text} isOpen={store.error.isOpen} />
    </ApiRequestContext.Provider>
  );
}

export default App;
