import '../styles/OrgEventCard.css'
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react'
import axios from 'axios'

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

interface EventCardProp {
  event: Event
}

const handleDelete = async (eventId: string) => {
  if (window.confirm('Are you sure you want to delete this event?')) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`https://cop4331project.dev/api/events/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  }
};

export default function OrgEventCard({ event }: EventCardProp){
  const navigate = useNavigate();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return(
    <div 
      key={event._id}
      className="eventCard"
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
                    <span className="statValue">{event.capacity}</span>
                    <span className="statLabel">spots left</span>
                  </div>
                )}
              </div>
              {event.ticketPrice !== undefined && event.ticketPrice > 0 && (
                <div className="price">${event.ticketPrice}</div>
              )}
            </div>
            <div className='event-buttons-container'>
              <button className='camera-button' onClick={() => navigate(`/checkin/${event._id}`)}><Camera /></button>
              <button className='edit-button' onClick={() => navigate(`/edit-event/${event._id}`)}>Edit</button>
              <button className='delete-button' onClick={() => handleDelete(event._id)}>Delete</button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
