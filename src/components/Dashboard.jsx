import { useState } from 'react';
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const Dashboard = ({ filteredResults, setSearchInput, setRegionFilter, setMinPop }) => {
  // STRETCH FEATURE: State to toggle visibility of charts
  const [showCharts, setShowCharts] = useState(true);
  
  // Data for Chart 1: Top 5 countries by population
  const barData = [...filteredResults]
    .sort((a, b) => b.population - a.population)
    .slice(0, 5)
    .map(c => ({ 
        name: c.name.common, 
        population: c.population 
    }));

  // Data for Chart 2: Countries per Region
  const regionCounts = filteredResults.reduce((acc, country) => {
    acc[country.region] = (acc[country.region] || 0) + 1;
    return acc;
  }, {});
  
  const pieData = Object.keys(regionCounts).map(region => ({ 
      name: region, 
      value: regionCounts[region] 
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="dashboard">
      <h1>🌍 World Nations Dashboard</h1>

      {/* STRETCH FEATURE: Toggle Button */}
      <button 
        className="toggle-btn"
        onClick={() => setShowCharts(!showCharts)}
        style={{ 
          marginBottom: '20px', 
          padding: '10px 20px', 
          cursor: 'pointer', 
          borderRadius: '8px', 
          border: 'none', 
          background: '#8884d8', 
          color: 'white', 
          fontWeight: 'bold' 
        }}
      >
        {showCharts ? "Hide Visualizations" : "Show Visualizations"}
      </button>
      
      {/* Conditional Rendering for Charts */}
      {showCharts && (
        <div className="charts-container" style={{ display: 'flex', gap: '20px', height: '350px', marginBottom: '40px', background: '#1a1a1a', padding: '20px', borderRadius: '12px' }}>
          
          <div style={{ width: '50%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#ccc" interval={0} tick={{fontSize: 10}} />
                <YAxis 
                  stroke="#ccc"
                  width={75} 
                  tickFormatter={(val) => val >= 1e9 ? `${(val/1e9).toFixed(1)}B` : `${(val/1e6).toFixed(0)}M`} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px', color: '#fff' }}
                  formatter={(value) => [value.toLocaleString(), "Population"]}
                />
                <Bar dataKey="population" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ width: '50%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" cy="50%" 
                  outerRadius={80} 
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Search and Filters Section */}
      <div className="controls" style={{ marginBottom: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <input 
          type="text" 
          placeholder="Search by name..." 
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#222', color: '#fff' }}
          onChange={(e) => setSearchInput(e.target.value)} 
        />
        <select 
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#222', color: '#fff' }}
          onChange={(e) => setRegionFilter(e.target.value)}
        >
          <option value="">All Regions</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>
        <input 
          type="number" 
          placeholder="Min Population" 
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#222', color: '#fff' }}
          onChange={(e) => setMinPop(Number(e.target.value))} 
        />
      </div>

      {/* List Section: Links each item to its unique Detail View */}
      <div className="list">
        {filteredResults.length > 0 ? (
          filteredResults.map((country, index) => (
            <Link to={`/country/${country.name.common}`} key={index} className="country-link" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="country-card">
                <img src={country.flags.png} alt={`${country.name.common} flag`} width="40px" style={{ borderRadius: '4px' }} />
                <div className="country-info">
                  <strong>{country.name.common}</strong>
                  <p>👥 {country.population.toLocaleString()} | 🗺️ {country.region}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No countries match your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;