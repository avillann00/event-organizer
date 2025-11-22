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
        console.log('rsvpId: ', rsvpId)
        const response = await axios.post('', {
          rsvpId,
          eventId: id
        })

        if(response.status === 200){
          setMessage('QR code valid. Checked in')
        }
      }
      catch(error){
        console.error('error verifying qr code: ', error)
        setMessage('Error verifying QR code')
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
