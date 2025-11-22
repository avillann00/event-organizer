import { useState, useEffect } from 'react'
import axios from 'axios'
import NotLoggedInPage from '../components/NotLoggedInPage'
import { useNavigate } from 'react-router-dom'
import RsvpCard from '../components/RsvpCard'
import '../styles/UserRsvps.css'

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


interface Rsvp{
  _id: string
  status: string
  eventId: Event
  userId: string
}

export default function UserRsvps(){
  const navigate = useNavigate()

  const [rsvps, setRsvps] = useState<Rsvp>([])

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    const getRsvps = async () => {
      try{
        const response = await axios.get(`https://cop4331project.dev/api/rsvp/?userId=${userId}`)

        if(response.status === 200){
          setRsvps(response.data.data)
        }
      }
      catch(error){
        console.error('error getting rsvps: ', error)
      }
    }


    if(localStorage.getItem('loggedIn') === 'true'){
      getRsvps()
    }
  }, [])

  const mappedRsvps = rsvps?.map((rsvp) => (
    <RsvpCard key={rsvp._id} rsvp={rsvp} />
  ))

  if(localStorage.getItem('loggedIn') !== 'true'){
    return <NotLoggedInPage />
  }

  return(
    <div className='pageWrapper'>
      <div className='container'>
        <div className='topBar'>
          <button className='backButton' onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1 className='header'>Your RSVPs</h1>
        </div>

        <div className='eventsGrid'>
          {rsvps.length > 0 
            ? mappedRsvps 
            : <h2 className='emptyState'>You have not RSVP’d to any event yet</h2>}
        </div>
      </div>
    </div>
  )
}
