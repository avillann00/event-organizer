import { useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // UCF center position
  const centerPosition = { lat: 28.6024, lng: -81.2001 };
  
  // Sample event data - replace with your actual data source
  const events = [
    {
      id: 1,
      title: "UCF Football Game",
      description: "Knights vs. Bulls - Home Game",
      position: { lat: 28.6075, lng: -81.1982 },
      date: "Nov 15, 2025",
      category: "sports"
    },
    {
      id: 2,
      title: "Tech Meetup",
      description: "Web Development Workshop",
      position: { lat: 28.6010, lng: -81.2005 },
      date: "Nov 20, 2025",
      category: "tech"
    },
    {
      id: 3,
      title: "Art Exhibition",
      description: "Student Art Showcase",
      position: { lat: 28.6030, lng: -81.1990 },
      date: "Nov 22, 2025",
      category: "art"
    },
    {
      id: 4,
      title: "Career Fair",
      description: "Fall 2025 Career Expo",
      position: { lat: 28.6000, lng: -81.2020 },
      date: "Nov 25, 2025",
      category: "career"
    }
  ];

  // Function to get pin color based on event category
  const getPinColor = (category) => {
    const colors = {
      sports: "#FFB300",
      tech: "#1E88E5",
      art: "#E91E63",
      career: "#43A047"
    };
    return colors[category] || "#9E9E9E";
  };

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
        <header style={{
          padding: "20px",
          background: "#1976D2",
          color: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h1 style={{ margin: 0, fontSize: "24px" }}>UCF Event Organizer</h1>
          <p style={{ margin: "5px 0 0 0", fontSize: "14px", opacity: 0.9 }}>
            Discover events near campus
          </p>
        </header>
        
        <div style={{ flex: 1, position: "relative" }}>
          <Map 
            zoom={15} 
            center={centerPosition}
            mapId="DEMO_MAP_ID" // Optional: Create a Map ID in Google Cloud Console for custom styling
            gestureHandling="greedy"
            disableDefaultUI={false}
          >
            {events.map((event) => (
              <AdvancedMarker
                key={event.id}
                position={event.position}
                onClick={() => setSelectedEvent(event)}
              >
                <Pin
                  background={getPinColor(event.category)}
                  borderColor="#fff"
                  glyphColor="#fff"
                  scale={1.2}
                />
              </AdvancedMarker>
            ))}

            {selectedEvent && (
              <InfoWindow
                position={selectedEvent.position}
                onCloseClick={() => setSelectedEvent(null)}
              >
                <div style={{
                  padding: "10px",
                  maxWidth: "250px",
                  cursor: "pointer"
                }}
                onClick={() => {
                  // Navigate to event details page
                  console.log(`Navigate to event: ${selectedEvent.id}`);
                  // Replace with: navigate(`/event/${selectedEvent.id}`)
                }}>
                  <h3 style={{ 
                    margin: "0 0 8px 0", 
                    fontSize: "16px",
                    color: "#1976D2"
                  }}>
                    {selectedEvent.title}
                  </h3>
                  <p style={{ 
                    margin: "4px 0", 
                    fontSize: "14px",
                    color: "#666"
                  }}>
                    {selectedEvent.description}
                  </p>
                  <p style={{ 
                    margin: "4px 0", 
                    fontSize: "12px",
                    color: "#999"
                  }}>
                    📅 {selectedEvent.date}
                  </p>
                  <p style={{ 
                    color: "#1976D2", 
                    margin: "8px 0 0 0",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}>
                    View Details →
                  </p>
                </div>
              </InfoWindow>
            )}
          </Map>
        </div>

        {/* Event count indicator */}
        <div style={{
          position: "absolute",
          top: "100px",
          right: "20px",
          background: "white",
          padding: "15px 20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          zIndex: 1000
        }}>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            <strong>{events.length}</strong> events nearby
          </p>
        </div>
      </div>
    </APIProvider>
  );
}