import { useState, useEffect } from 'react'
import Scanner from '../components/Scanner'
import NotLoggedInPage from '../components/NotLoggedInPage'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import '../styles/Checkin.css'

export default function Checkin(){
  const navigate = useNavigate()
  const { id } = useParams()

  const [rsvpId, setRsvpId] = useState('')
  const [message, setMessage] = useState('')
  const [hasScanned, setHasScanned] = useState(false)

  useEffect(() => {
    const verify = async () => {
      try{
        const response = await axios.post(
          'https://cop4331project.dev/api/rsvp/checkin',
          { rsvpId, eventId: id }
        )

        setMessage('QR code valid. Checked in')
      } 
      catch(error){
        console.error('error verifying qr code: ', error)

        if(error.response && error.response.data?.message){
          const msg = error.response.data.message

          if(msg.includes('already')){
            setMessage('User already checked in')
          }
          else if(msg.includes('not found')){
            setMessage('Invalid QR code or RSVP not found')
          }
          else{
            setMessage(msg)
          }
        }
        else{
          setMessage('Network error verifying QR code')
        }
      }
      finally{
        setTimeout(() => setHasScanned(false), 1500)
      }
    }

    if(rsvpId && !hasScanned && localStorage.getItem('loggedIn') === 'true'){
      setHasScanned(true)
      verify()
    }
  }, [rsvpId, id, hasScanned])

  if(localStorage.getItem('loggedIn') !== 'true'){
    return <NotLoggedInPage />
  }

  return (
    <div className='checkin-container'>
      <button className='back-button' onClick={() => navigate(-1)}>Back</button>

      <Scanner onScan={(value) => setRsvpId(value)} />

      {message && (
        <p className={`checkin-message ${message.includes('valid') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
