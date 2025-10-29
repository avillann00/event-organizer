import { useState } from "react";
import "./styles.css"

export default function Login(){
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState("")

  const handleLogin = () =>{
    //Need login functionality and error message for failure to login
  }

  return (
    <>
      <div className="form-container sign-in-container">
        <form action="#">
          <br />
          <h1>Login</h1>
          <br />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <br />
          <button type="button" onClick={handleLogin}>
            Submit
          </button>
          {errors && <p className="error-text">{errors}</p>}
        </form>
      </div>
    </>
  )
}