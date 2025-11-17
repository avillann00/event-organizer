import '../styles/RSVPModal.css'
import { useState } from 'react'

interface RSVPModalProps {
  event: {
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
  };
  onClose: () => void;
  onConfirm: (updatedEvent: any) => void;
}

export default function RSVPModal({ event, onClose, onConfirm }: RSVPModalProps) {
  const [loading, setLoading] =useState(false)

  const handleConfirmRSVP = async() => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')

      if (!token){
        alert('No token found. Please log in again.')
        return
      }

      const response = await fetch('https://cop4331project.dev/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          eventId: event._id,
          status: 'going'
        })
      })
      const data = await response.json()

      if (data.success){
        const updatedEvent = {...event, rsvpCount: event.rsvpCount + 1, capacity: event.capacity - 1 }
        alert('RSVP successful!')
        onConfirm(updatedEvent)
        onClose()
      } else {
        alert(data.message || 'RSVP failed')
      }
    } catch (error) {
      console.error('RSVP error:', error)
      alert('Error creating RSVP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Confirm RSVP for {event.title}</h2>
        <p>
          Price:{' '}
          {event.ticketPrice === 0 || !event.ticketPrice
            ? 'Free'
            : `$${event.ticketPrice}`}
        </p>
        <div className="modal-btns">
          <button 
            onClick={onClose} 
            className="cancel-btn"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirmRSVP} 
            className="confirm-btn"
            disabled={loading}
            >
              {loading ? 'Confirm...' : 'Confirm RSVP'}
          </button>        
        </div>
      </div>
    </div>
  )
}
