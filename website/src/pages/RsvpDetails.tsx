import QrCode from '../components/QrCode'
import '../styles/RsvpDetails.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import NotLoggedInPage from '../components/NotLoggedInPage'
import { CiClock1 } from 'react-icons/ci'
import { SlLocationPin } from 'react-icons/sl'

interface Event{
  _id: string
  title: string
  description: string
  startTime: string
  endTime: string
  address: string
  media: string[]
  ticketPrice: number
  rsvpCount: number
  capacity: number
}

interface Rsvp{
  _id: string
  userId: string
  status: string
  eventId: Event
}

export default function RsvpDetails(){
  const location = useLocation()
  const passedRsvp = location.state?.rsvp

  const navigate = useNavigate()

  const [rsvp, setRsvp] = useState<Rsvp>(passedRsvp || null)

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

  if(localStorage.getItem('loggedIn') !== 'true'){
    return <NotLoggedInPage />
  }

  return(
    <div className='rsvp-details-page'>
      <header className='rsvp-header'>
        <button className='back-btn' onClick={() => navigate(-1)}>← Back</button>
        <h1 className='rsvp-title'>{rsvp.eventId.title}</h1>
      </header>

      <div className='hero-section'>
        <QrCode rsvpId={rsvp._id} />
      </div>

      <div className='rsvp-card'>
        <h1>{rsvp.eventId.title}</h1>
        <div className='rsvp-meta'>
          <p><CiClock1 /> {formatDateRange(rsvp.eventId.startTime)} • {formatDateTime(rsvp.eventId.startTime, rsvp.eventId.endTime)}</p>
          <p><SlLocationPin /> {rsvp.eventId.address || 'No address provided'}</p>
        </div>

        <section className='details-section'>
          <h2>Event Details</h2>
          <p>{rsvp.eventId.description || 'No description available.'}</p>
        </section>

        <div className='stats-inline'>
          <div>
            <strong>Capacity</strong>
            <span>{rsvp.eventId.capacity || '—'}</span>
          </div>
          <div>
            <strong>Tickets</strong>
            <span>{rsvp.eventId.ticketPrice ? `$${rsvp.eventId.ticketPrice}` : 'Free'}</span>
          </div>
          <div>
            <strong>RSVPs</strong>
            <span>{rsvp.eventId.rsvpCount || 0}</span>
          </div>
        </div>

        {rsvp.eventId.keywords?.length > 0 && (
          <section className='tags-section'>
            <h2>Tags</h2>
            <div className='tag-container'>
              {rsvp.eventId.keywords.map((tag, i) => (
                <span key={i} className='tag'>{tag}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
