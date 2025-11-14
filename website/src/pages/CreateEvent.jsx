import '../styles/CreateEvent.css'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Select from 'react-select'
import BottomNav from '../components/BottomNav'
import NotLoggedInPage from '../components/NotLoggedInPage'

export default function CreateEvent(){
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [capacity, setCapacity] = useState('')
  const [ticketPrice, setTicketPrice] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [keyWords, setKeyWords] = useState([])
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [media, setMedia] = useState(null)
  const [mediaUrl, setMediaUrl] = useState('')

  const keyWordOptions = [
    { value: 'music', label: 'Music' },
    { value: 'sports', label: 'Sports' },
    { value: 'food', label: 'Food' },
    { value: 'tech', label: 'Tech' }
  ]

  const uploadImage = async () => {
    if(!media){
      return
    }
    console.log('media: ', media)

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
      alert('Error uploading image')
    }
  }

  const getCoordinates = async (address) => {
    const encoded = encodeURIComponent(address);

    const res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encoded}&format=json`)

    if(!res.data.length){
      alert('Location not found')
      throw new Error('location not found')
    }

    setLatitude(res.data[0].lat)
    setLongitude(res.data[0].lon)

    return{
      lat: parseFloat(res.data[0].lat),
      lng: parseFloat(res.data[0].lon),
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !description || !address || !capacity || !ticketPrice || !startTime || !endTime) {
      alert('All fields are required')
      return
    }

    try{
      const coords = await getCoordinates(address)

      let imageUrl = mediaUrl
      if(media && !mediaUrl){
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
        keywords: keyWords.map(k => k.value),
        media: imageUrl ? [imageUrl] : []
      }

      const response = await axios.post('https://cop4331project.dev/api/events', eventData)

      if(response.status === 200 || response.status === 201){
        alert('Event created successfully!')
        navigate('/homepage')
      }
      else{
        alert('Error creating event')
        console.error('error creating event')
      }
    }
    catch(error){
      console.error('error details:', error)
    }
  }

  if(localStorage.getItem('loggedIn') !== 'true'){
    return <NotLoggedInPage />
  }

  return(
    <div>
      <div className='create-event-container'>
        <h2 className='create-event-title'>Create New Event</h2>
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
            onChange={setKeyWords}
            classNamePrefix='select'
            placeholder='Select key words...'
          />
          </label>

          <label>
            Event Image
            <input
              type='file'
              accept='image/*'
              onChange={(e) => setMedia(e.target.files[0])}
            />
          </label>
          
          <button type='submit' className='submit-btn'>Create Event</button>
        </form>
      </div>
      <BottomNav />
    </div>
  )
}
