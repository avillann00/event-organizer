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

      if(response.status === 200){
        setVerified(true)
        setMessage('')
      }
      setMessage('Email sent! Follow the instructions then come back')
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

  return (
    <div className="reset-page">
      <div className="reset-page-background"></div>

      <button className="back-button" onClick={() => navigate(-1)}>
        Back
      </button>

      <div className="container">
        {verified ? (
          <form>
            <h1>Update Your Password</h1>

            <p className="info-text">
              Your reset link has been verified.  
              Enter your <strong>new password</strong> below to finish the reset.
            </p>

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              type="password"
            />

            <input
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm new password"
              type="password"
            />

            <button type="submit" onClick={resetPassword}>
              Reset Password
            </button>

            {message && <p>{message}</p>}
          </form>
        ) : (
          <form>
            <h1>Reset Password</h1>

            <p className="info-text">
              Enter your <strong>account email</strong> below.  
              We’ll send you a secure link to reset your password.
            </p>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
            />

            <button type="submit" onClick={handleSubmit}>
              Send Reset Email
            </button>

            {message && <p>{message}</p>}
          </form>
        )}
      </div>
    </div>
  )
}
