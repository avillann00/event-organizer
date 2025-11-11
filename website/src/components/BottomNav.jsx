import { Home, User, Menu, Pencil } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/BottomNav.css'

export default function BottomNav(){
  const navigate = useNavigate()
  const location = useLocation()

  const role = localStorage.getItem('userRole')

  const current = location.pathname

  return (
    <div className='bottom-nav'>

      <button onClick={() => navigate('/homepage')}>
        <Home size={24} color={current === '/homepage' ? '#1976D2' : '#666'} />
        <span>Home</span>
      </button>

      <button onClick={() => navigate('/profile')}>
        <User size={24} color={current === '/profile' ? '#1976D2' : '#666'} />
        <span>Profile</span>
      </button>

      {role === 'user' ? (
        <button onClick={() => navigate('/events')}>
          <Menu size={24} color={current === '/events' ? '#1976D2' : '#666'} />
          <span>Menu</span>
        </button>
      ) : (
        <button onClick={() => navigate('/create-event')}>
          <Pencil size={24} color={current === '/create-event' ? '#1976D2' : '#666'} />
          <span>Create Event</span>
        </button>
      )}

    </div>
  )
}
