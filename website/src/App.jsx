import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { EventProvider } from './context/EventContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Landing from './pages/Landing'
import CreateEvent from './pages/CreateEvent'
import EventsListPage from './pages/EventsListPage'
import EventDetails from './pages/EventDetails'
import Homepage from './pages/Homepage'
import ProfilePage from './pages/ProfilePage'
import AboutPage from './pages/AboutPage'
import ResetPassword from './pages/ResetPassword'
import OrgEvents from './pages/OrgEvents'
import UserRsvps from './pages/UserRsvps'
import RecoverEmail from './pages/RecoverEmail'
import ResetEmail from './pages/ResetEmail'
import RsvpDetails from './pages/RsvpDetails'
import Checkin from './pages/Checkin'

export default function App() {
  return(
    <EventProvider>
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
          <Route path='/about' element={<AboutPage />} />
          <Route path='/password-reset' element={<ResetPassword />} />
          <Route path='/organizer-events' element={<OrgEvents />} />
          <Route path='/user-rsvps' element={<UserRsvps />} />
          <Route path='/recover-email' element={<RecoverEmail />} />
          <Route path='/reset-email' element={<ResetEmail />} />
          <Route path='/rsvps/:id' element={<RsvpDetails />} />
          <Route path='/checkin/:id' element={<Checkin />} />
        </Routes>
      </BrowserRouter>
    </EventProvider>
  )
}
