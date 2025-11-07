import { useNavigate } from 'react-router-dom';
import { BsCart2 } from "react-icons/bs";
import { HiOutlineBars3 } from "react-icons/hi2";
import React, { useState } from 'react';
import './styles/LandingPage.css';
import Logo from './assets/EventOrganizerLogo.svg'
import Home from './components/Home.jsx'

import { 
  Box,
  Drawer, 
  ListItem, 
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
{/* import Logo from '../assets/logo.png'; */}


const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const menuOptions = [
    { text: "Home", icon: <HomeIcon /> },
    { text: "About", icon: <InfoIcon /> },
  ];

  return <div>Navbar</div>;
};


export default function Landing(){
  const navigate = useNavigate()

  return (
    <div>
      <nav>
        <div className="nav-logo-container">
          <img src={Logo} alt="Event Organizer logo"/>
        </div>

        <div className="navbar-links-container">
          <a href="">Home</a>
          <a href="">About</a>
        </div>

      </nav>

      <div>
        <Home/>
      </div>
    </div>
  );
}