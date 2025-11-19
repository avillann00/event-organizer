import { useState, useEffect } from 'react';
import '../styles/EventsListPage.css';
import { useNavigate } from 'react-router-dom'
// @ts-ignore
import BottomNav from '../components/BottomNav'
// @ts-ignore
import NotLoggedInPage from '../components/NotLoggedInPage'
// @ts-ignore
import { useEvents } from '../context/EventContext'
import EventCard from '../components/EventCard'

interface Event {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  address: string;
  media: string[];
  ticketPrice: number;
  rsvpCount: number;
  capacity: number;
}

export default function EventsListPage() {
  const navigate = useNavigate();
  const { events, setEvents } = useEvents()
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter events based on search query
  const filteredEvents = searchQuery.trim() 
    ? events.filter((event: any) => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.keywords?.some((k: string) => k.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : events;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://cop4331project.dev/api/events/')
        const data = await response.json();
        setEvents(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    if(localStorage.getItem('loggedIn') === 'true'){
      fetchEvents();
    }
  }, []);

  if(localStorage.getItem('loggedIn') !== 'true'){
    return <NotLoggedInPage />
  }

  return (
    <div className="pageWrapper">
      <div className="container">
        {loading ? (
          <div className="loadingText">Loading events...</div>
        ) : (
          <>
            <h1 className="header">Upcoming Events</h1>
            
            <div className="searchContainer">
              <div className="searchWrapper">
                <input
                  type="text"
                  placeholder="Search events by title or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="searchInput"
                />
              </div>
            </div>

            <div className="eventsGrid">
              {filteredEvents.length === 0 ? (
                <div className="emptyState">No events available</div>
              ) : (
                filteredEvents.map((event: any) => (
                  <EventCard key={event._id} event={event} />
                ))
              )}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
