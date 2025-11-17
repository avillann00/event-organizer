import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/ResetPassword.css'

export default function ResetEmail() {
    const navigate = useNavigate()

    const [backupEmail, setBackupEmail] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const [message, setMessage] = useState("")

    const resetEmail = async (e: React.FormEvent ) => {
        e.preventDefault()

        if (!backupEmail || !newEmail) {
        setMessage("All fields required")
        return
        }

        try {
            const response = await axios.post(
                "https://cop4331project.dev/api/users/reset-email",
                {
                    backupEmail,
                    newEmail,
                }
            )

            if (response.status === 200) {
                setMessage("Email changed successfully!")
                setTimeout(() => navigate("/login"), 1500)
            }
        } catch (error) {
        console.error("Error resetting email:", error)
        setMessage(
            "Error resetting email. Make sure you verified the link from backup email."
        )
        }
    }

    return (
        <div className="reset-page">
            <div className="reset-page-background"></div>

            <button className="back-button" onClick={() => navigate(-1)}>
            Back
            </button>

            <div className="container">
            <form>
                <h1>Reset Primary Email</h1>

                <p className="info-text">
                Enter your <strong>backup email</strong> and the
                <strong> new primary email</strong> you want to use.  
                Make sure you have already clicked the verification link sent to your backup email.
                </p>

                <input
                value={backupEmail}
                onChange={(e) => setBackupEmail(e.target.value)}
                placeholder="Backup email"
                type="email"
                />

                <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="New primary email"
                type="email"
                />

                <button type="submit" onClick={resetEmail}>
                Reset Email
                </button>

                {message && <p>{message}</p>}
            </form>
            </div>
        </div>
    )
}

