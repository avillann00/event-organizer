import { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow
} from '@vis.gl/react-google-maps';
import { Home, User, Menu, MapPin } from 'lucide-react';
import BottomNav from '../components/BottomNav'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function App() {
  const navigate = useNavigate()

  const [userLocation, setUserLocation] = useState({ lat: 28.6024, lng: -81.2001 });
  
  // Event data will go here
  const [fetchedEvents, setFetchedEvents] = useState([])

  const [radius, setRadius] = useState('')
  const [category, setCategory] = useState('')

  const [selected, setSelected] = useState()

  useEffect(() => {
    if(!navigator.geolocation){
      alert('Could not get location with your current browser')
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
      },
      (error) => {
        console.error('error getting user location: ', error)
      }
    )
  }, [])

  useEffect(() => { 
    const getEvents = async () => {
      try{
        const response = await axios.get(`https://cop4331project.dev/api/events/?radius=${radius}&category=${category}`)

        if(response.status === 200){
          setFetchedEvents(response.data)
        }
      }
      catch(error){   
        console.error('error getting events: ', error)
      }
    }
    
    if(localStorage.getItem('loggedIn') !== 'true'){
      getEvents()
    }
  }, [])

  if(localStorage.getItem('loggedIn') !== 'true'){
    return(
      <div>
        <h1>You must be logged in.</h1>
        <button onClick={() => navigate('/login')}>Login</button>
      </div>
    )
  }

  const pins = fetchedEvents?.map((event) => {
    <Marker
      key={event.id}
      position={{lat: null, lng: null}}
      onClick={() => setSelected(event)}
    />
  })

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
          {pins}
        </Map>

        {selected && (
          <InfoWindow
            position={{lat: selected.lat, lng: selected.lng}}
            onClick={() => {
              setSelected(null)
              navigate(`/events/${selected._id}`, { state: { selected } })
            }}
          >
            <div> 
              <h3>{selected.title}</h3>
              <span>{selected.description}</span>
            </div>
          </InfoWindow>
        )}

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
        <BottomNav />
        
      </div>
    </APIProvider>
  );
}
