import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../styles/EventDetails.css'
import NotLoggedInPage from '../components/NotLoggedInPage'
import RSVPModal from '../components/RSVPModal'
import { CiClock1 } from "react-icons/ci"
import { SlLocationPin } from "react-icons/sl"

export default function EventDetails() {
  const location = useLocation()
  const passedEvent = location.state?.event
  const [event, setEvent] = useState(passedEvent || null)
  const navigate = useNavigate()
  const [showRSVPModal, setShowRSVPModal] = useState(false)

  useEffect(() => {
    if (!event) navigate('/')
  }, [event, navigate])

  if (!event) return null

  const formatDateRange = (start) => {
    const s = new Date(start)
    const opts = { weekday: 'short', month: 'short', day: 'numeric' }
    return `${s.toLocaleString('en-US', opts)}`
  }

  const formatDateTime = (start, end) => {
    const st = new Date(start)
    const en = new Date(end)
    return `${st.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} to ${en.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
  }

  const handleRSVPConfirm = () => {
    console.log('RSVP confirmed!', event._id)
    setShowRSVPModal(false)
  }

  if(localStorage.getItem('loggedIn') !== 'true'){
    return <NotLoggedInPage />
  }

  return (
    <div className="event-details-page">
      <header className="event-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="event-title">{event.title}</h1>
      </header>

        <div className="hero-section">
          {event.media?.[0] || event.mediaUrl ? (
            <img src={event.media?.[0] || event.mediaUrl} alt="Event" className="event-hero" />
          ) : (
            <span className="placeholder-icon">📅</span>
          )}
        </div>

        <div className="event-card">
          <h1>{event.title}</h1>
          <div className="event-meta">
            <p><CiClock1 /> {formatDateRange(event.startTime)} • {formatDateTime(event.startTime, event.endTime)}</p>
            <p><SlLocationPin /> {event.address || 'No address provided'}</p>
          </div>

          <section className="details-section">
            <h2>Event Details</h2>
            <p>{event.description || 'No description available.'}</p>
          </section>

          <div className="stats-inline">
            <div>
              <strong>Capacity</strong>
              <span>{event.capacity || '—'}</span>
            </div>
            <div>
              <strong>Tickets</strong>
              <span>{event.ticketPrice ? `$${event.ticketPrice}` : 'Free'}</span>
            </div>
            <div>
              <strong>RSVPs</strong>
              <span>{event.rsvpCount || 0}</span>
            </div>
          </div>

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
            RSVP TO THIS EVENT!
          </button>
        </div>
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
