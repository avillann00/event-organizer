import '../styles/RSVPModal.css'

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
  onConfirm: () => void;
}

export default function RSVPModal({ event, onClose, onConfirm }: RSVPModalProps) {
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
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={onConfirm} className="confirm-btn">
            Confirm RSVP
          </button>
          
        </div>
      </div>
    </div>
  )
}