import { useNavigate } from 'react-router-dom';
import { BsCart2 } from "react-icons/bs";
import { HiOutlineBars3 } from "react-icons/hi2";
import React, { useState } from 'react';
import './styles/LandingPage.css';

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
          
        </div>

        <div className="navbar-links-container">
          <a href="">Home</a>
          <a href="">About</a>
        </div>
      </nav>

      <div>
        <h1>Landing Page</h1>
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={() => navigate('/register')}>Register</button>
      </div>
    </div>
  );
}