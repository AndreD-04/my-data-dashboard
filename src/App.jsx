import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import DetailView from "./components/DetailView.jsx";
import './App.css'

function App() {
  const [list, setList] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [minPop, setMinPop] = useState(0);

  useEffect(() => {
    const fetchCountries = async () => {
      // Fetching extra fields (subregion, languages) for the Detail View requirement
      const response = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,subregion,languages");
      const data = await response.json();
      setList(data);
      setFilteredResults(data);
    };
    fetchCountries().catch(console.error);
  }, []);

  useEffect(() => {
    let filtered = list;
    if (searchInput !== "") {
      filtered = filtered.filter((country) =>
        country.name.common.toLowerCase().includes(searchInput.toLowerCase())
      );
    }
    if (regionFilter !== "") {
      filtered = filtered.filter((country) => country.region === regionFilter);
    }
    if (minPop > 0) {
      filtered = filtered.filter((country) => country.population >= minPop);
    }
    setFilteredResults(filtered);
  }, [searchInput, regionFilter, minPop, list]);

  return (
    <BrowserRouter>
      <div className="App-layout">
        {/* SIDEBAR: Stays visible in all views */}
        <nav className="sidebar">
          <h2>🌍 Nations</h2>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <Dashboard 
                filteredResults={filteredResults}
                setSearchInput={setSearchInput}
                setRegionFilter={setRegionFilter}
                setMinPop={setMinPop}
              />
            } />
            <Route path="/country/:symbol" element={<DetailView list={list} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App