import '../styles/Navbar.css';
import Logo from '../assets/EventOrganizerLogo.svg';

export default function Navbar() {
  return (
    <nav>
      <div className="nav-logo-container">
        <a href="/">
          <img src={Logo} alt="Event Organizer logo"/>
        </a>
      </div>

      <div className="navbar-links-container">
        <a href="">Home</a>
        <a href="">About</a>
      </div>
    </nav>
  );
}

