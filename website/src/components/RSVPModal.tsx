import '../styles/RSVPModal.css'

interface RSVPModalProps{
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

export default function RSVPModal({event, onClose, onConfirm} : RSVPModalProps){

    return (
            <div className="card">
                <h2>Confirm RSVP for {event.title}</h2>
                <button onClick={onConfirm} className="submit-btn">RSVP</button>
                <button onClick={onClose} className="submit-btn" >Cancel</button>
            </div>
    )
}