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
import NotLoggedInPage from '../components/NotLoggedInPage'
import { useEvents } from '../context/EventContext'
import axios from 'axios'

const options = [
  'sports',
  'food',
  'tech',
  'art',
  'games',
  'outdoors'
]

export default function App() {
  const navigate = useNavigate()

  const [userLocation, setUserLocation] = useState({ lat: 28.6024, lng: -81.2001 });
  
  const { events, setEvents } = useEvents()

  // const [radius, setRadius] = useState('')
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')

  const [selected, setSelected] = useState()
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filteredEvents = search?.trim() 
    ? events?.filter((event) => 
        event?.title.toLowerCase().includes(search?.toLowerCase()) ||
        event?.keywords?.some((k) => k.toLowerCase().includes(search?.toLowerCase()))
      )
    : events;

  useEffect(() => {
    if(!navigator.geolocation){
      return
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
        let response
        if(categories.length > 0){
          response = await axios.get(`https://cop4331project.dev/api/events/?keywords=${categories}`)
        } 
        else{
          response = await axios.get(`https://cop4331project.dev/api/events/`)
        }

        console.log('response: ', response)
        if(response.status === 200){
          setEvents(response.data.data)
        }
      }
      catch(error){   
        console.error('error getting events: ', error)
      }
    }
    
    if(localStorage.getItem('loggedIn') === 'true'){
      getEvents()
    }
  }, [categories])

  if(localStorage.getItem('loggedIn') !== 'true'){
    return <NotLoggedInPage />
  }

  const pins = filteredEvents?.map((event) => (
    <Marker
      key={event._id}
      position={{lat: event.location?.latitude || userLocation.lat, lng: event.location?.longitude || userLocation.lng}}
      onClick={() => setSelected(event)}
    />
  ))

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div style={{ height: "100vh", width: "100%", position: "relative", zIndex: 1 }}>
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
            onChange={(e) => setSearch(e.target.value)}
            value={search}
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
            onClick={() => setIsFilterOpen(prev => !prev)}
          >
            Filter
          </button>
        </div>

        {isFilterOpen && (
          <div
            style={{
              position: 'absolute',
              top: '70px',
              left: '20px',
              right: '20px',
              zIndex: 1000,
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: '8px',
              padding: '12px'
            }}
          >
            <p style={{ marginBottom: '8px', fontWeight: '600' }}>Filter by Category</p>

            {options.map((category) => (
              <label
                key={category}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 0',
                  cursor: 'pointer'
                }}
              >
                <input
                  type='checkbox'
                  checked={categories.includes(category)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCategories((prev) => [...prev, category]);
                    } else {
                      setCategories((prev) => prev.filter((c) => c !== category));
                    }
                  }}
                />
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </label>
            ))}

            <button
              onClick={() => setIsFilterOpen(false)}
              style={{
                marginTop: '10px',
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                background: '#1976D2',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Done
            </button>
          </div>
        )}

        {/* Map */}
        <Map 
          defaultZoom={15} 
          defaultCenter={userLocation}
          gestureHandling="greedy"
          disableDefaultUI={true}
          clickableIcons={false}
          mapId="8a66c35f8f7f5392"
        >
          {pins}
        </Map>

        {selected && (
          <InfoWindow
            position={{
              lat: selected.location?.latitude ?? userLocation.lat,
              lng: selected.location?.longitude ?? userLocation.lng
            }}
            onCloseClick={() => setSelected(null)}
          >
            <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/events/${selected._id}`, {
                  state: { event: selected }
                })
              }
            >
              <h3 style={{ margin: 0 }}>{selected.title}</h3>
              <p style={{ margin: 0 }}>{selected.description}</p>
              <p style={{ color: "blue", textDecoration: "underline", marginTop: "4px" }}>
                View Details →
              </p>
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
