import { useState } from 'react'
import { Home, User, Menu, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import '../styles/BottomNav.css'

export default function BottomNav(){
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const role = localStorage.getItem('userRole')

  return (
    <div className="bottom-nav">
      <button onClick={() => navigate('/homepage')}>
        <Home size={24} color="#1976D2" />
        <span>Home</span>
      </button>

      <button onClick={() => navigate('/profile')}>
        <User size={24} color="#666" />
        <span>Profile</span>
      </button>

      {role === 'user' ? (
        <button onClick={() => navigate('/events')}>
          <Menu size={24} color="#666" />
          <span>Menu</span>
        </button>
      ) : (
        <button onClick={() => navigate('/create-event')}>
          <Pencil size={24} color="#666" />
          <span>Create Event</span>
        </button>
      )}
    </div>
  )
}

