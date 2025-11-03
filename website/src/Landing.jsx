import { useNavigate } from 'react-router-dom'

export default function Landing(){
  const navigate = useNavigate()

  return(
    <>
      <div> 
        <h1>Landing Page</h1>
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={() => navigate('/register')}>Register</button>
      </div>
    </>
  )
}