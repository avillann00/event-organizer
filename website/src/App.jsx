import { useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';

export default function App() {
  console.log('App component is rendering!');
  console.log('All env vars:', import.meta.env);
  console.log('API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
  
  const position = { lat: 28.6024, lng: -81.2001 };
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div style={{height: "100vh"}}>
        <h1>Testing Map</h1>
        <Map zoom={15} center={position}></Map>
      </div>
    </APIProvider>
  );
}