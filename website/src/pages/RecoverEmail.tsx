import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/ResetPassword.css'

export default function RecoverEmail(){
  const navigate = useNavigate()

  const [backupEmail, setBackupEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if(!backupEmail || !password){
      setMessage('All fields are required')
      return
    }

    try{
      const response = await axios.post('https://cop4331project.dev/api/users/forgot-email', {
        backupEmail,
        password
      })

      if(response.status === 200){
        setSent(true)
        setMessage('Email recovery link sent! Check your backup email')
      }

    }
    catch(error){
      console.error('Error sending email recovery: ', error)
      setMessage('Error sending recovery link')
    }
  }

  return (
  <div className="reset-page">
    <div className="reset-page-background"></div>
    <button className="back-button" onClick={() => navigate(-1)}>Back</button>

    <div className="container">
      {!sent ? (
        <form>
          <h1>Recover Primary Email</h1>

          <p className="info-text">
            Enter your <strong>backup email</strong> and your 
            <strong> account password</strong>. We&apos;ll send a secure
            recovery link to your backup email so you can update your primary email.
          </p>

          <input
            value={backupEmail}
            onChange={(e) => setBackupEmail(e.target.value)}
            placeholder="Backup email"
            type="email"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Account password"
            type="password"
          />

          <button type="submit" onClick={handleSubmit}>
            Send Recovery Link
          </button>

          {message && <p>{message}</p>}
        </form>
      ) : (
        <form>
          <h1>Verification Sent!</h1>
          <p className="info-text">
            Check your backup email for the recovery link. After verifying,
            you can continue to reset your primary email.
          </p>

          <button type="button" onClick={() => navigate('/reset-email')}>
            Continue
          </button>

          {message && <p>{message}</p>}
        </form>
      )}
    </div>
  </div>
    )
}
