import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Landing from './pages/Landing'
import CreateEvent from './pages/CreateEvent'
import EventsListPage from './pages/EventsListPage'
import EventDetails from './pages/EventDetails'
import Homepage from './pages/Homepage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/events' element={<EventsListPage />} />
        <Route path='/create-event' element={<CreateEvent />} />
        <Route path='/events/:id' element={<EventDetails />} />
        <Route path='/homepage' element={<Homepage />} />
        <Route path='/profile' element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}
