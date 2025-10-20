

export default function App() {
  return (
    <>
      <div className="wrapper">
        <div className="form-box register">
          <form action="">
            <h1>Register </h1>
            <div className="input-box">
              <input type="text" placeholder="Full Name" required />
            </div>
            <div className="input box">
              <input type="email" placeholder="Email" required />
            </div>
            <div className="input box">
              <input type="text" placeholder="Password" required />
            </div>
            <div className="input box">
              <input type="text" placeholder="Confirm Password" required />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}