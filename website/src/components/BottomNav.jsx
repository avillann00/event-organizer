import { useState } from 'react'
import { Home, User, Menu, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom'

export default function BottomNav(){
  const [events, setEvents] = useState([])

  return(
    <div style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "70px",
      background: "white",
      borderTop: "1px solid #e0e0e0",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      zIndex: 1000
    }}>
      <button
        onClick={() => console.log("Home clicked")}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          padding: "8px 16px"
        }}
      >
        <Home size={24} color="#1976D2" />
        <span style={{ fontSize: "12px", color: "#666" }}>Home</span>
      </button>

      <button
        onClick={() => console.log("Profile clicked")}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          padding: "8px 16px"
        }}
      >
        <User size={24} color="#666" />
        <span style={{ fontSize: "12px", color: "#666" }}>Profile</span>
      </button>

      <button
        onClick={() => console.log("Menu clicked")}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          padding: "8px 16px"
        }}
      >
        <Menu size={24} color="#666" />
        <span style={{ fontSize: "12px", color: "#666" }}>Menu</span>
      </button>
    </div>
  )
}
