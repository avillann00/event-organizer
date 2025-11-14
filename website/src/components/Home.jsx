import React from "react";
import { useRef, useEffect } from 'react';
import Lottie from "lottie-react";
import "../styles/LandingPage.css";
import { useNavigate } from "react-router-dom";
import calendarAnimation from "../assets/online-appointment.json";

const Home = () => {
  const navigate = useNavigate();

  const lottieRef = useRef();

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.60);
    }
  }, []);

  return (
    <div className="home-container">
      <div className="home-banner-container">
        <img
          src="/BannerBackground13.svg"
          alt="background splash art"
          className="home-banner-background"
        />

        {/* Wrap text + animation together */}
        <div className="home-content">
          <div className="home-text-section">
            <h1>
              <span>Welcome to the</span>
              <br />
              <span>Event Organizer</span>
            </h1>
            <p>Find and manage events with ease.</p>
            <div className="button-group">
              <button onClick={() => navigate("/login")}>Login</button>
              <button onClick={() => navigate("/register")}>Register</button>
            </div>
          </div>
          
          <div className="home-animation">
            <Lottie 
              lottieRef={lottieRef}
              animationData={calendarAnimation} 
              loop={true} 
              />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;