import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [list, setList] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [minPop, setMinPop] = useState(0);

  // 1. Fetch Data on Mount
  useEffect(() => {
    const fetchCountries = async () => {
      // Fetching specific fields to ensure compatibility with REST Countries API
      const response = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital");
      const data = await response.json();
      setList(data);
      setFilteredResults(data);
    };
    fetchCountries().catch(console.error);
  }, []);

  // 2. Combined Filtering Logic (Search + Region + Population)
  // This satisfies the "Multiple filters can be applied simultaneously" stretch feature
  useEffect(() => {
    let filtered = list;

    if (searchInput !== "") {
      filtered = filtered.filter((country) =>
        country.name.common.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    if (regionFilter !== "") {
      filtered = filtered.filter((country) => 
        country.region === regionFilter
      );
    }

    if (minPop > 0) {
      filtered = filtered.filter((country) => 
        country.population >= minPop
      );
    }

    setFilteredResults(filtered);
  }, [searchInput, regionFilter, minPop, list]);

  // 3. Summary Statistics (Required: at least 3)
  const totalCountries = filteredResults.length;
  const avgPopulation = totalCountries > 0 
    ? Math.round(filteredResults.reduce((acc, curr) => acc + curr.population, 0) / totalCountries)
    : 0;
  const currentRegions = [...new Set(filteredResults.map(item => item.region))].length;

  return (
    <div className="App">
      <h1>🌍 World Nations Dashboard</h1>

      {/* STATS SECTION */}
      <div className="stats-container">
        <div className="card">
          <h3>{totalCountries}</h3>
          <p>Countries Shown</p>
        </div>
        <div className="card">
          <h3>{avgPopulation.toLocaleString()}</h3>
          <p>Avg Population</p>
        </div>
        <div className="card">
          <h3>{currentRegions}</h3>
          <p>Regions Shown</p>
        </div>
      </div>

      <div className="controls">
        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search by name..."
          onChange={(e) => setSearchInput(e.target.value)}
        />

        {/* REGION FILTER (Dropdown) */}
        <select onChange={(e) => setRegionFilter(e.target.value)}>
          <option value="">All Regions</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>

        {/* POPULATION FILTER (Specific Bounds Stretch Feature) */}
        <input
          type="number"
          placeholder="Min Population"
          onChange={(e) => setMinPop(Number(e.target.value))}
        />
      </div>

      {/* LIST VIEW */}
      <div className="list">
        {filteredResults.length > 0 ? (
          filteredResults.map((country, index) => (
            <div className="country-card" key={index}>
              <img src={country.flags.png} alt="flag" width="40px" />
              <div className="country-info">
                <strong>{country.name.common}</strong>
                <p>📍 {country.capital?.[0] || "N/A"} | 👥 {country.population.toLocaleString()} | 🗺️ {country.region}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No results found matching your filters.</p>
        )}
      </div>
    </div>
  )
}

export default App