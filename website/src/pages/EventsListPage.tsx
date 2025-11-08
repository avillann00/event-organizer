import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function EventsListPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://cop4331project.dev/api/events');
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      <div style={styles.container}>
        {loading ? (
          <div style={styles.loadingText}>Loading events...</div>
        ) : (
          <>
            <h1 style={styles.header}>Upcoming Events</h1>
            <div style={styles.eventsGrid}>
              {events.length === 0 ? (
                <div style={styles.emptyState}>No events available</div>
              ) : (
                events.map((event) => (
                  <div key={event._id} style={styles.eventCard}>
                    <div style={styles.imageContainer}>
                      <img 
                        src={event.media?.[0] || 'https://cop4331project.dev/uploads/1762488665303.png'} 
                        alt={event.title}
                        style={styles.eventImage}
                      />
                      {(event.ticketPrice === 0 || event.ticketPrice === undefined) && (
                        <div style={styles.freeBadge}>FREE</div>
                      )}
                    </div>
                    
                    <div style={styles.cardContent}>
                      <div style={styles.contentLayout}>
                        <div style={styles.dateSection}>
                          <div style={styles.dateDay}>
                            {new Date(event.startTime).toLocaleDateString('en-US', { day: 'numeric' })}
                          </div>
                          <div style={styles.dateMonth}>
                            {new Date(event.startTime).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                          </div>
                          <div style={styles.dateTime}>
                            {formatTime(event.startTime)}
                          </div>
                        </div>

                        <div style={styles.infoSection}>
                          {event.address && (
                            <div style={styles.locationText}>{event.address}</div>
                          )}
                          <h2 style={styles.eventTitle}>{event.title}</h2>
                          <p style={styles.description}>{event.description}</p>
                          
                          <div style={styles.footer}>
                            <div style={styles.statsContainer}>
                              <div style={styles.stat}>
                                <span style={styles.statValue}>{event.rsvpCount}</span>
                                <span style={styles.statLabel}>attending</span>
                              </div>
                              {event.capacity && (
                                <div style={styles.stat}>
                                  <span style={styles.statValue}>{event.capacity - event.rsvpCount}</span>
                                  <span style={styles.statLabel}>spots left</span>
                                </div>
                              )}
                            </div>
                            {event.ticketPrice !== undefined && event.ticketPrice > 0 && (
                              <div style={styles.price}>${event.ticketPrice}</div>
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
    </div>
  );
}

const styles = {
  pageWrapper: {
    paddingTop: '100px',
    minHeight: '100vh',
    backgroundColor: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "SF Pro Display", system-ui, sans-serif',
  },
  container: {
    padding: '120px 20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    fontSize: '2.5rem',
    fontWeight: 'bold' as const,
    marginBottom: '40px',
    color: '#1a1a1a',
    margin: '0 0 40px 0',
  },
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: '30px',
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  imageContainer: {
    position: 'relative' as const,
    width: '100%',
    height: '240px',
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    transition: 'transform 0.3s ease',
  },
  freeBadge: {
    position: 'absolute' as const,
    top: '16px',
    right: '16px',
    backgroundColor: 'gold',
    color: '#1a1a1a',
    padding: '12px 45px',
    borderRadius: '20px',
    border: '2px solid #1a1a1a',
    fontSize: '12px',
    fontWeight: 'bold' as const,
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
  },
  cardContent: {
    padding: '24px',
  },
  contentLayout: {
    display: 'flex',
    gap: '20px',
  },
  dateSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: '80px',
    paddingTop: '4px',
  },
  dateDay: {
    fontSize: '2.5rem',
    fontWeight: 'bold' as const,
    color: '#1a1a1a',
    lineHeight: '1',
  },
  dateMonth: {
    fontSize: '12px',
    fontWeight: 'bold' as const,
    color: '#999',
    letterSpacing: '1px',
    marginTop: '4px',
  },
  dateTime: {
    fontSize: '13px',
    color: '#666',
    marginTop: '8px',
    fontWeight: '500' as const,
  },
  infoSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  locationText: {
    fontSize: '11px',
    color: '#999',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    fontWeight: 'bold' as const,
    marginBottom: '8px',
  },
  eventTitle: {
    fontSize: '1.4rem',
    fontWeight: 'bold' as const,
    marginBottom: '12px',
    color: '#1a1a1a',
    lineHeight: '1.3',
    margin: '0 0 12px 0',
  },
  description: {
    fontSize: '14px',
    color: '#333',
    lineHeight: '1.6',
    marginBottom: '16px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '12px',
  },
  statsContainer: {
    display: 'flex',
    gap: '20px',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  statValue: {
    fontSize: '1.125rem',
    fontWeight: 'bold' as const,
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  price: {
    fontSize: '1.2rem',
    fontWeight: 'bold' as const,
    color: '#1a1a1a',
    backgroundColor: 'gold',
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #1a1a1a',
  },
  loadingText: {
    fontSize: '1.25rem',
    textAlign: 'center' as const,
    color: '#333',
    marginTop: '100px',
    fontWeight: 'bold' as const,
  },
  emptyState: {
    fontSize: '1.125rem',
    textAlign: 'center' as const,
    color: '#666',
    marginTop: '100px',
    gridColumn: '1 / -1',
  },
};