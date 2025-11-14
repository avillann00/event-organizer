import BottomNav from '../components/BottomNav'
import { User, Calendar } from 'lucide-react'
import '../styles/ProfilePage.css'
import { useNavigate } from 'react-router-dom'
import NotLoggedInPage from '../components/NotLoggedInPage'

export default function ProfilePage(){
  const navigate = useNavigate()

  const name = localStorage.getItem('userName')
  const email = localStorage.getItem('userEmail')

  if(localStorage.getItem('loggedIn') !== 'true'){
    return <NotLoggedInPage />
  }

  return(
    <div className='profile-page'>
      <h1>Profile Page</h1>

      <div className='profile-icon'>
        <User size={100} color='#1976D2' />
      </div>

      <div className='profile-info'>
        <span>{name}</span>
        <span>{email}</span>
      </div>
      
      {/*
      <button
        className='profile-events-btn'
        onClick={() => navigate('/profile')}
      >
        <Calendar size={50} color='#1976D2' />
        <span>Your Events</span>
      </button>
      */}

      <button
        className='logout-button'
        onClick={() => {
          localStorage.clear()
          navigate('/login')
        }}
      >
        Logout
      </button>

      <BottomNav />
    </div>
  )
}
