import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import Landing from './Landing'
import EventsListPage from './pages/EventsListPage'

export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/events' element={<EventsListPage />} />
      </Routes>
    </BrowserRouter>
  )
}
