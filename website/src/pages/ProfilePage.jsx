import BottomNav from '../components/BottomNav'
import { User, Calendar } from 'lucide-react'
import '../styles/ProfilePage.css'
import { useNavigate } from 'react-router-dom'
import NotLoggedInPage from '../components/NotLoggedInPage'

export default function ProfilePage(){
  const navigate = useNavigate()

  const name = localStorage.getItem('userName')
  const email = localStorage.getItem('userEmail')
  const role = localStorage.getItem('userRole')

  if(localStorage.getItem('loggedIn') !== 'true'){
    return <NotLoggedInPage />
  }

  return(
    <div className='profile-page'>
      <div className="profile-card">
      <h1>Profile</h1>

      
        <div className='profile-icon'>
          <User size={100} color='#21452bff' />
        </div>

        <div className='profile-info'>
          <span className='profile-name'>{name}</span>
          <span className='profile-email'>{email}</span>
        </div>
  
        {role === 'user' ? (
          <button
            className='profile-events-btn'
            onClick={() => navigate('/user-rsvps')}
          >
            <Calendar size={50} color='#21452bff' />
            <span>Your RSVP's</span>
          </button> 
        ) : (
          <button
            className='profile-events-btn'D
            onClick={() => navigate('/organizer-events')}
          >
            <Calendar size={50} color='#21452bff' />
            <span>Your Events</span>
          </button> 
        )}
      

      <button
        className='logout-button'
        onClick={() => {
          localStorage.clear()
          navigate('/login')
        }}
      >
        Logout
      </button>
      </div>
      <BottomNav />
    </div>
  )
}
