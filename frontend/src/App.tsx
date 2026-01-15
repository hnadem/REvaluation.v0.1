import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_KEY;

export default function App() {
  const [propertyType, setPropertyType] = useState("apartment");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [latlon, setLatlon] = useState<{lat:number,lon:number} | null>(null);
  const [surface, setSurface] = useState(50);
  const [rooms, setRooms] = useState(2);
  const [condition, setCondition] = useState(3);
  const [result, setResult] = useState<any>(null);

  async function fetchSuggestions(q: string) {
    if (!q || !LOCATIONIQ_KEY) return;
    try {
      const res = await fetch(`https://us1.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_KEY}&q=${encodeURIComponent(q)}&limit=5&format=json`);
      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  }

  function pickSuggestion(s: any) {
    setAddress(s.display_name);
    setLatlon({ lat: parseFloat(s.lat), lon: parseFloat(s.lon) });
    setSuggestions([]);
  }

  async function submit() {
    if (!latlon) {
      alert("Please select an address suggestion to validate location.");
      return;
    }
    const resp = await axios.post(`${BACKEND_URL}/api/estimate`, {
      property_type: propertyType,
      lat: latlon.lat,
      lon: latlon.lon,
      surface_sqm: surface,
      rooms: rooms,
      condition: condition
    });
    setResult(resp.data);
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>REvaluation (MVP)</h2>
      <div>
        <label>Type:</label>
        <select value={propertyType} onChange={e=>setPropertyType(e.target.value)}>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="office">Office</option>
        </select>
      </div>

      <div>
        <label>Address:</label>
        <input value={address} onChange={e=>{ setAddress(e.target.value); fetchSuggestions(e.target.value); }} placeholder="Start typing address..." style={{width: '60%'}}/>
        <div>
          {suggestions.map(s => (
            <div key={s.place_id} style={{cursor:'pointer'}} onClick={()=>pickSuggestion(s)}>
              {s.display_name}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label>Surface (sqm):</label>
        <input type="number" value={surface} onChange={e=>setSurface(parseFloat(e.target.value))}/>
      </div>

      <div>
        <label>Rooms:</label>
        <input type="number" value={rooms} onChange={e=>setRooms(parseInt(e.target.value))}/>
      </div>

      <div>
        <label>Condition (1-5):</label>
        <input type="number" min={1} max={5} value={condition} onChange={e=>setCondition(parseInt(e.target.value))}/>
      </div>

      <div style={{marginTop:12}}>
        <button onClick={submit}>Value</button>
      </div>

      {latlon && (
        <div style={{marginTop:12}}>
          <MapContainer center={[latlon.lat, latlon.lon]} zoom={15}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[latlon.lat, latlon.lon]}>
              <Popup>{address}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {result && (
        <div style={{marginTop:12}}>
          <h3>Estimate</h3>
          <div>Price / sqm: {result.price_per_sqm.min} - {result.price_per_sqm.max} (median {result.price_per_sqm.median})</div>
          <div>Total: {result.total_price.min} - {result.total_price.max} (median {result.total_price.median})</div>
          <div>Confidence: {result.confidence_label} ({Math.round(result.confidence_score*100)}%)</div>
        </div>
      )}
    </div>
  );
}
