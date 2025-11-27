import '../styles/CreateEvent.css' // reuse the same styling
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Select from 'react-select'
import BottomNav from '../components/BottomNav'
import NotLoggedInPage from '../components/NotLoggedInPage'

export default function EditEvent(){
  const navigate = useNavigate()
  const { id } = useParams() // Get event ID from URL

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [capacity, setCapacity] = useState('')
  const [ticketPrice, setTicketPrice] = useState('')
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<Date | null>(null)
  const [keyWords, setKeyWords] = useState<Array<{value: string, label: string}>>([])
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [media, setMedia] = useState<File | null>(null)
  const [mediaUrl, setMediaUrl] = useState('')

  const keyWordOptions = [
    { value: 'music', label: 'Music' },
    { value: 'sports', label: 'Sports' },
    { value: 'food', label: 'Food' },
    { value: 'tech', label: 'Tech' }
  ]

  const [message, setMessage] = useState('')

  // Fetch existing event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`https://cop4331project.dev/api/events?_id=${id}`)
        if (response.status === 200 && response.data.data.length > 0) {
          const event = response.data.data[0]
          setTitle(event.title)
          setDescription(event.description)
          setAddress(event.address)
          setCapacity(event.capacity)
          setTicketPrice(event.ticketPrice)
          setStartTime(new Date(event.startTime))
          setEndTime(new Date(event.endTime))
          setLatitude(event.location?.latitude || '')
          setLongitude(event.location?.longitude || '')
          setMediaUrl(event.media?.[0] || '')
          
          // Convert keywords to select format
          if (event.keywords) {
            const selectedKeywords = event.keywords.map((kw: string) => 
              keyWordOptions.find(option => option.value === kw)
            ).filter(Boolean)
            setKeyWords(selectedKeywords)
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error)
        setMessage('Error loading event')
      }
    }
    fetchEvent()
  }, [id])

  const uploadImage = async () => {
    if(!media){
      return mediaUrl // Return existing media URL if no new image
    }

    const formData = new FormData()
    formData.append('image', media)

    try{
      const response = await axios.post('https://cop4331project.dev/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }       
      })

      if(response.status == 200 || response.status == 201){
        setMediaUrl(response.data.url)
        return response.data.url
      }
    }
    catch(error){
      console.error('error uploading image: ', error)
      setMessage('Error uploading image')
    }
  }

  const getCoordinates = async (address: string) => {
    const encoded = encodeURIComponent(address)

    const res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encoded}&format=json`)

    if(!res.data.length){
      setMessage('Location not found')
      throw new Error('location not found')
    }

    setLatitude(res.data[0].lat)
    setLongitude(res.data[0].lon)

    return{
      lat: parseFloat(res.data[0].lat),
      lng: parseFloat(res.data[0].lon),
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || !address || !capacity || !ticketPrice || !startTime || !endTime) {
      setMessage('All fields are required')
      return
    }

    try{
      const coords = await getCoordinates(address)

      let imageUrl = mediaUrl
      if(media){
        imageUrl = await uploadImage()
      }

      const eventData = {
        token: localStorage.getItem('token'),
        
        title,
        description,
        address,
        capacity,
        ticketPrice,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        latitude: coords.lat,
        longitude: coords.lng,
        keywords: keyWords.map((k: {value: string, label: string}) => k.value),
        media: imageUrl ? [imageUrl] : []
      }

      // Use PUT request to update_event endpoint
      const response = await axios.put(`https://cop4331project.dev/api/events/${id}`, eventData)

      if(response.status === 200){
        setMessage('Event updated successfully!')
        navigate('/organizer-events') // Navigate back to organizer events page
      }
      else{
        setMessage('Error updating event')
        console.error('error updating event')
      }
    }
    catch(error){
      console.error('error details:', error)
      setMessage('Error updating event')
    }
  }

  if(localStorage.getItem('loggedIn') !== 'true'){
    return <NotLoggedInPage />
  }

  return(
    <div>
      <div className='create-event-container'>
        <h2 className='create-event-title'>Edit Event</h2>
        <form onSubmit={handleSubmit} className='create-event-form'>

          <label>
            Title
            <input
              type='text'
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g. UCF Homecoming Party'
              value={title}
            />
          </label>

          <label>
            Description
            <input
              type='text'
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Describe your event...'
              value={description}
            />
          </label>

          <label>
            Address
            <input
              type='text'
              onChange={(e) => setAddress(e.target.value)}
              placeholder='e.g. 123 Pegasus Dr, Orlando FL'
              value={address}
            />
          </label>

          {latitude && longitude && (
            <p>📍 Coordinates: {latitude}, {longitude}</p>
          )}

          <label>
            Capacity
            <input
              type='number'
              onChange={(e) => setCapacity(e.target.value)}
              placeholder='e.g. 50'
              value={capacity}
            />
          </label>

          <label>
            Ticket Price
            <input
              type='number'
              onChange={(e) => setTicketPrice(e.target.value)}
              placeholder='e.g. 10'
              value={ticketPrice}
            />
          </label>

          <label>
            Start Time
            <DatePicker
              selected={startTime}
              onChange={(date) => setStartTime(date)}
              showTimeSelect
              dateFormat='Pp'
              placeholderText='Select start date & time'
            />
          </label>

          <label>
            End Time
            <DatePicker
              selected={endTime}
              onChange={(date) => setEndTime(date)}
              showTimeSelect
              dateFormat='Pp'
              placeholderText='Select end date & time'
            />
          </label>
          
          <label>
          Key Words
          <Select
            isMulti
            name='keyWords'
            options={keyWordOptions}
            value={keyWords}
            onChange={(newValue) => setKeyWords(newValue as Array<{value: string, label: string}>)}
            classNamePrefix='select'
            placeholder='Select key words...'
          />
          </label>

          <label>
            Event Image
            <input
              type='file'
              accept='image/*'
              onChange={(e) => setMedia(e.target.files?.[0] || null)}
            />
            {mediaUrl && !media && (
              <p>Current image: <img src={mediaUrl} alt="Current event" style={{maxWidth: '100px'}} /></p>
            )}
          </label>
          
          <button type='submit' className='submit-btn'>Update Event</button>
          <button type='button' className='cancel-btn' onClick={() => navigate('/organizer-events')}>Cancel</button>
          {message && <p>{message}</p>}
        </form>
      </div>
      <BottomNav />
    </div>
  )
}