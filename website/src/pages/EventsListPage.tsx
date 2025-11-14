import { useState, useEffect } from 'react';
import '../styles/EventsListPage.css';
import { useNavigate } from 'react-router-dom'
// @ts-ignore
import BottomNav from '../components/BottomNav'
// @ts-ignore
import NotLoggedInPage from '../components/NotLoggedInPage'
// @ts-ignore
import { useEvents } from '../context/EventContext'

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
  const navigate = useNavigate()
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

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
                  <div 
                    key={event._id}
                    className="eventCard"
                    onClick={() => navigate(`/events/${event._id}`, { state: { event } })}
                  >
                    <div className="imageContainer">
                      <img 
                        src={event.media?.[0] || 'https://cop4331project.dev/uploads/1762488665303.png'} 
                        alt={event.title}
                        className="eventImage"
                      />
                      {(event.ticketPrice === 0 || event.ticketPrice === undefined) && (
                        <div className="freeBadge">FREE</div>
                      )}
                    </div>
                    
                    <div className="cardContent">
                      <div className="contentLayout">
                        <div className="dateSection">
                          <div className="dateDay">
                            {new Date(event.startTime).toLocaleDateString('en-US', { day: 'numeric' })}
                          </div>
                          <div className="dateMonth">
                            {new Date(event.startTime).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                          </div>
                          <div className="dateTime">
                            {formatTime(event.startTime)}
                          </div>
                        </div>

                        <div className="infoSection">
                          {event.address && (
                            <div className="locationText">{event.address}</div>
                          )}
                          <h2 className="eventTitle">{event.title}</h2>
                          <p className="description">{event.description}</p>
                          
                          <div className="footer">
                            <div className="statsContainer">
                              <div className="stat">
                                <span className="statValue">{event.rsvpCount}</span>
                                <span className="statLabel">attending</span>
                              </div>
                              {event.capacity && (
                                <div className="stat">
                                  <span className="statValue">{event.capacity - event.rsvpCount}</span>
                                  <span className="statLabel">spots left</span>
                                </div>
                              )}
                            </div>
                            {event.ticketPrice !== undefined && event.ticketPrice > 0 && (
                              <div className="price">${event.ticketPrice}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
