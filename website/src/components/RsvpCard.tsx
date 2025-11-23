import '../styles/RsvpCard.css'
import { useNavigate } from 'react-router-dom'

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

interface RsvpCardProp{
  rsvp: Rsvp
}

export default function RsvpCard({ rsvp }: RsvpCardProp){
  const navigate = useNavigate()

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return(
    <div 
      key={rsvp._id}
      className='rsvpCard'
      onClick={() => navigate(`/rsvps/${rsvp._id}`, { state: { rsvp } })}
    >
      <div className='imageContainer'>
        <img 
          src={rsvp.eventId.media?.[0] || 'https://cop4331project.dev/uploads/1762488665303.png'} 
          alt={rsvp.eventId.title}
          className='rsvpImage'
        />
      </div>
      
      <div className='cardContent'>
        <div className='contentLayout'>
          <div className='dateSection'>
            <div className='dateDay'>
              {new Date(rsvp.eventId.startTime).toLocaleDateString('en-US', { day: 'numeric' })}
            </div>
            <div className='dateMonth'>
              {new Date(rsvp.eventId.startTime).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
            </div>
            <div className='dateTime'>
              {formatTime(rsvp.eventId.startTime)}
            </div>
          </div>

          <div className='infoSection'>
            {rsvp.eventId.address && (
              <div className='locationText'>{rsvp.eventId.address}</div>
            )}
            <h2 className='rsvpTitle'>{rsvp.eventId.title}</h2>
            <p className='description'>{rsvp.eventId.description}</p>
            <p className='description'>Status: {rsvp.status}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
