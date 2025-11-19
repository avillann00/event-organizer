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
        <a className="navbar-button" href="/homepage">Home</a>
        <a className="navbar-button" href="/about">About</a>
        <a className="navbar-button" href="/events">Events</a>
      </div>
    </nav>
  );
}
