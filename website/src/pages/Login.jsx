import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/styles.css"
import axios from 'axios'

export default function Login(){
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState("")
  
  const handleLogin = async () => {
    try{
      const response = await axios.post('https://cop4331project.dev/api/users/login', {
        email: email,
        password: password
      })

      if(response.status == 200){
        const data = response.data.data
        localStorage.setItem('userEmail', data.user.email)
        localStorage.setItem('userId', data.user.id)
        localStorage.setItem('userName', data.user.name)
        localStorage.setItem('userRole', data.user.role)
        localStorage.setItem('token', data.token)
        localStorage.setItem('loggedIn', 'true')

        alert('Logged in!')
        navigate('/homepage')
      }
    }
    catch(error){
      console.error('error logging in: ', error)
      alert('Error logging in')
    }
  }
  
  return (
    <div className="auth-page">
      <div className="auth-page-background"></div>
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back
      </button>
      
      <div className="container" style={{width: '500px', maxWidth: '90%', minHeight: '50vh', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <div className="form-container sign-in-container" style={{position: 'relative', width: '100%', left: '0', transform: 'none'}}>
          <form action="#" style={{padding: '40px 50px'}}>
            <h1>Login</h1>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{marginTop: '30px'}}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{marginTop: '15px', marginBottom: '30px'}}
            />
            <button type="button" onClick={handleLogin}>
              Submit
            </button>
            {errors && <p className="error-text">{errors}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}
