import BottomNav from '../components/BottomNav'

export default function ProfilePage(){

  if(localStorage.getItem('loggedIn') !== 'true'){
    return(
      <div>
        <h1>You must be logged in.</h1>
        <button onClick={() => navigate('/login')}>Login</button>
      </div>
    )
  }

  return(
    <div>
      <h1>Profile Page</h1>
      <BottomNav />
    </div>
  )
}
