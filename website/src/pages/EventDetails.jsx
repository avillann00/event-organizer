import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../styles/EventDetails.css'
import NotLoggedInPage from '../components/NotLoggedInPage'
import RSVPModal from '../components/RSVPModal'
import { CiClock1 } from "react-icons/ci"
import { SlLocationPin } from "react-icons/sl"
import axios from 'axios'

export default function EventDetails() {
  const location = useLocation()
  const passedEvent = location.state?.event
  const [event, setEvent] = useState(passedEvent || null)
  const navigate = useNavigate()
  const [showRSVPModal, setShowRSVPModal] = useState(false)
  const role = localStorage.getItem('userRole')
  const isOrganizer = role === 'organizer'

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

  const handleRSVPConfirm = (updatedEvent) => {
    setEvent(updatedEvent)
    console.log('RSVP confirmed!', event._id)
    setShowRSVPModal(false)
  }

  const handleEditEvent = () => {
    navigate(`/edit-event/${event._id}`, { state: { event } })
  }

  const handleDeleteEvent = async () => {
  if (!window.confirm('Are you sure you want to delete this event?')) {
    return
  }

  try {
    const token = localStorage.getItem('token')
    
    // CORRECT: Use the event ID in the URL and token in Authorization header
    const response = await axios.delete(`https://cop4331project.dev/api/events/${event._id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.data.success) {
      alert('Event deleted successfully!')
      navigate('/events')
    } else {
      alert('Error: ' + response.data.message)
    }
  } catch (error) {
    console.error('Error deleting event:', error)
    alert('Error deleting event: ' + (error.response?.data?.message || error.message))
  }
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
        
        {/* Show Edit/Delete buttons for organizers, RSVP for users */}
        {isOrganizer ? (
          <div className="organizer-buttons">
            <button className="edit-event-btn" onClick={handleEditEvent}>
              ✏️ EDIT EVENT
            </button>
            <button className="delete-event-btn" onClick={handleDeleteEvent}>
              🗑️ DELETE EVENT
            </button>
          </div>
        ) : (
          <button className="submit-btn" onClick={() => setShowRSVPModal(true)}>
            RSVP TO THIS EVENT!
          </button>
        )}
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