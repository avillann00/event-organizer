import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../styles/EventDetails.css'
import RSVPModal from '../components/RSVPModal';


export default function EventDetails() {
  const location = useLocation()
  const passedEvent = location.state?.event
  const [event, setEvent] = useState(passedEvent || null)
  const navigate = useNavigate()
  const [showRSVPModal, setShowRSVPModal] = useState(false)

  

  useEffect(() => {
    if(!event){
      navigate('/')
    }
  }, [event, navigate])

  if(!event){
    return null
  }

  const formatDateRange = (start, end) => {
    const s = new Date(start)
    const e = new Date(end)
    const opts = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }
    return `${s.toLocaleString('en-US', opts)} — ${e.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
  }

  const handleRSVPConfirm = () => {
    // passing the API call here later
    console.log('RSVP confirmed!', event._id)
    setShowRSVPModal(false)
  }

  return (
    <div className="event-details-page">
      <header className="event-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="event-title">{event.title}</h1>
      </header>

      {event.media?.[0] || event.mediaUrl ? (
        <img src={event.media?.[0] || event.mediaUrl} alt="Event" className="event-hero" />
      ) : (
        <div className="event-placeholder">
          <span className="placeholder-icon">📅</span>
        </div>
      )}

      <main className="event-main">
        <section className="meta-section">
          <div className="meta-item">
            <span className="meta-icon">🕒</span>
            <span>{formatDateRange(event.startTime, event.endTime)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">📍</span>
            <span>{event.address || 'No address provided'}</span>
          </div>
        </section>

        <section className="description-section">
          <h2>About This Event</h2>
          <p>{event.description || 'No description available.'}</p>
        </section>

        <section className="details-card">
          <DetailRow icon="👥" label="Capacity" value={event.capacity ? `${event.capacity} people` : 'Not specified'} />
          <hr />
          <DetailRow icon="🎟️" label="Tickets" value={(event.ticketPrice === 0 || !event.ticketPrice) ? 'Free' : `$${event.ticketPrice}`} />
          <DetailRow icon="✅" label="RSVPs" value={`${event.rsvpCount || 0} attending`} />
        </section>

        {event.keywords?.length > 0 && (
          <section className="tags-section">
            <h2>Tags</h2>
            <div className="tag-container">
              {event.keywords.map((tag, i) => (
                <span key={i} className="tag">{tag}</span>
              ))}
            </div>
          </section>
        )}

        <button className="submit-btn" onClick={() => setShowRSVPModal(true)}>
        RSVP to this Event!
        </button>
      </main>
       {showRSVPModal && (
        <RSVPModal 
          event={event}
          onClose={() => setShowRSVPModal(false)}
          onConfirm={handleRSVPConfirm}
        />
      )}
      
      
    </div>
  )
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="detail-row">
      <span className="detail-icon">{icon}</span>
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  )
}
