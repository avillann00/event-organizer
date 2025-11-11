import '../styles/LandingPage.css';
import Home from '../components/Home.jsx';
import Navbar from '../components/Navbar';

export default function Landing(){
  return (
    <div>
      <Navbar />

      <div>
        <Home/>
      </div>
    </div>
  );
}
