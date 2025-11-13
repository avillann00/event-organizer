import '../styles/NotLoggedInPage.css'
import { useNavigate } from 'react-router-dom'

export default function NotLoggedInPage(){
  const navigate = useNavigate()

  return(
    <div className='not-logged-in-page'>
      <div className='not-logged-in-background'></div>

      <h1>You must be logged in.</h1>

      <button onClick={() => navigate('/login')}>
        Login
      </button>
    </div>
  )
}
