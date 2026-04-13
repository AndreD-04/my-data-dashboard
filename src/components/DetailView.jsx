import { useParams, Link } from "react-router-dom";

const DetailView = ({ list }) => {
  const { symbol } = useParams();
  
  // Find the country. Using optional chaining and toLowerCase for a safer match.
  const country = list?.find((c) => 
    c.name.common.toLowerCase() === symbol?.toLowerCase()
  );

  // If data is still loading or the country wasn't found
  if (!country) {
    return (
      <div className="detail-view" style={{ padding: '20px', color: 'white' }}>
        <h2>Loading country details...</h2>
        <p>If this takes too long, the country might not exist in the current list.</p>
        <Link title="Back Home" to="/" style={{ color: '#646cff' }}>← Back Home</Link>
      </div>
    );
  }

  return (
    <div className="detail-view" style={{ padding: '20px', color: 'white' }}>
      <Link title="Back to Dashboard" to="/" style={{ marginBottom: '20px', display: 'block', color: '#646cff' }}>
        ← Back to Dashboard
      </Link>
      
      <h1>{country.name.common}</h1>
      <img 
        src={country.flags.png} 
        alt={`Flag of ${country.name.common}`} 
        style={{ width: '250px', borderRadius: '8px', border: '1px solid #555' }} 
      />
      
      <div className="extra-info" style={{ marginTop: '20px', textAlign: 'left', lineHeight: '1.6' }}>
        <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '10px' }}>
          Additional Information
        </h3>
        <p><strong>Subregion:</strong> {country.subregion || "N/A"}</p>
        <p><strong>Capital City:</strong> {country.capital?.[0] || "N/A"}</p>
        <p><strong>Official Languages:</strong> {country.languages ? Object.values(country.languages).join(", ") : "N/A"}</p>
        <p><strong>Total Population:</strong> {country.population.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default DetailView;