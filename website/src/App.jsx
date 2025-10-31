import { useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';

export default function Intro() {
  const position = { lat: 26.6024, lng: 81.2001 };

  return (
    <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY}>
      <div>React Google Maps</div>
    </APIProvider>
  );
}