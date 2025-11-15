import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/ResetPassword.css'

export default function ResetPassword(){
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const [verified, setVerified] = useState(false)

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if(email.trim().length < 1){
      setMessage('Please enter an email')
      return
    }

    try{
      const response = await axios.post('https://cop4331project.dev/api/users/forgot-password', {
        email: email
      })

      setMessage('Email sent! Follow the instructions then come back')

      if(response.status === 200){
        setVerified(true)
        setMessage('')
      }
    }
    catch(error){
      console.error('error reseting password: ', error)
      setMessage('Error sending reset email')
    }
  }

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if(password !== passwordConfirm){
      setMessage('Passwords do not match')
      return
    }

    if(password.trim().length < 1 || passwordConfirm.trim().length < 1){
      setMessage('All fields are required')
      return
    }

    try{
      const response = await axios.post('https://cop4331project.dev/api/users/reset-password', {
        email: email,
        newPassword: password,
        confirmPassword: passwordConfirm
      })

      if(response.status === 200){
        setMessage('Password changed!')
        navigate('/login')
      }
    }
    catch(error){
      console.error('error reseting password: ', error)
      setMessage('Error reseting password. Ensure that you have followed the email\'s instructions')
    }

  }

  return(
    <div className='reset-page'>
      <button className='back-button' onClick={() => navigate(-1)}>Back</button>
      {verified ? (
        <form>
          <h1>Email Sent! After verification come back and update password</h1>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            type='password'
          />
          <input
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder='Confirm Password'
            type='password'
          />
          <button type='submit' onClick={resetPassword}>Reset</button>
          {message && <p>{message}</p>}
        </form>
      ) : (
        <form>
          <h1>Reset Password</h1>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            type='email'
          />
          <button type='submit' onClick={handleSubmit}>Send email</button>
          {message && <p>{message}</p>}
        </form>
      )}
    </div>
  )
}
