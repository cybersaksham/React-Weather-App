import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import Weather from "./Components/Weather";

function App() {
  const [searches, setSearches] = useState(
    JSON.parse(sessionStorage.getItem("searches")) || []
  );

  const [city, setCity] = useState(null);

  useEffect(() => {
    let newSearches = [];
    if (Array.from(searches).length === 0)
      newSearches = ["Jaipur", "Delhi", "Bombay"];
    else if (Array.from(searches).length === 1)
      newSearches = [...searches, "Jaipur", "Delhi"];
    else if (Array.from(searches).length === 2)
      newSearches = [...searches, "Jaipur"];
    setSearches(newSearches);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar setCity={setCity} />
      <div className="container my-3">
        <Weather city={city} />
      </div>
    </>
  );
}

export default App;
