import { useState } from 'react';
import {
  APIProvider,
  Map,
} from '@vis.gl/react-google-maps';
import { Home, User, Menu, MapPin } from 'lucide-react';

export default function App() {
  const [userLocation, setUserLocation] = useState({ lat: 28.6024, lng: -81.2001 });
  
  // Event data will go here
  const events = [];

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div style={{ height: "100vh", width: "100%", position: "relative" }}>
        {/* Search bar and filter at top */}
        <div style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          right: "20px",
          zIndex: 1000,
          display: "flex",
          gap: "10px"
        }}>
          <input
            type="text"
            placeholder="Search events..."
            style={{
              flex: 1,
              padding: "12px 16px",
              fontSize: "16px",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              outline: "none"
            }}
          />
          <button
            style={{
              padding: "12px 20px",
              fontSize: "16px",
              border: "none",
              borderRadius: "8px",
              background: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Filter
          </button>
        </div>

        {/* Map */}
        <Map 
          defaultZoom={15} 
          defaultCenter={userLocation}
          mapId="DEMO_MAP_ID"
          gestureHandling="greedy"
          disableDefaultUI={true}
          clickableIcons={false}
        >
        </Map>

        {/* Return to location button - bottom right */}
        <button
          onClick={() => {
            console.log("Return to user location");
            // Will implement map centering later
          }}
          style={{
            position: "absolute",
            bottom: "100px",
            right: "20px",
            width: "48px",
            height: "48px",
            border: "none",
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
        >
          <MapPin size={24} color="#1976D2" />
        </button>

        {/* Bottom navigation bar */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "70px",
          background: "white",
          borderTop: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          zIndex: 1000
        }}>
          <button
            onClick={() => console.log("Home clicked")}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              padding: "8px 16px"
            }}
          >
            <Home size={24} color="#1976D2" />
            <span style={{ fontSize: "12px", color: "#666" }}>Home</span>
          </button>

          <button
            onClick={() => console.log("Profile clicked")}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              padding: "8px 16px"
            }}
          >
            <User size={24} color="#666" />
            <span style={{ fontSize: "12px", color: "#666" }}>Profile</span>
          </button>

          <button
            onClick={() => console.log("Menu clicked")}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              padding: "8px 16px"
            }}
          >
            <Menu size={24} color="#666" />
            <span style={{ fontSize: "12px", color: "#666" }}>Menu</span>
          </button>
        </div>
      </div>
    </APIProvider>
  );
}