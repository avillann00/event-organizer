import '../styles/OrgEvents.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import NotLoggedInPage from '../components/NotLoggedInPage'
import OrgEventCard from '../components/OrgEventCard'
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

export default function OrgEvents(){
  const navigate = useNavigate()

  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const getEvents = async () => {
      try{
        const userId = localStorage.getItem('userId')

        const response = await axios.get(`https://cop4331project.dev/api/events/?organizerId=${userId}`)

        if(response.status === 200){
          setEvents(response.data.data)
        }
      }
      catch(error){
        console.error('error getting organizers events: ', error)
      }
    }

    
    if(localStorage.getItem('loggedIn') === 'true'){
      getEvents()
    }
  }, [])

  const mappedEvents = events?.map((event: Event) => (
    <OrgEventCard key={event._id} event={event} />   
  ))

  if(localStorage.getItem('loggedIn') !== 'true'){
    return <NotLoggedInPage />
  }

  return(
    <div className='org-events-page'>
      <button className='backButton' onClick={() => navigate(-1)}>Back</button>
      {events.length < 1 ? (
        <h1 className='no-events-message'>You currently have not made any events</h1>
      ) : (
        <div>
          <h1>Your events:</h1>
          <div className='org-events-list'>
            {mappedEvents}
          </div>
        </div>
      )}
    </div>
  )
}
