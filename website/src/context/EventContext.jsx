import { createContext, useContext, useState, useEffect } from 'react'

const EventContext = createContext()

export function EventProvider({ children }){
  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem('events')
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events])

  return(
    <EventContext.Provider value={{ events, setEvents }}>
      {children}
    </EventContext.Provider>
  )
}

export function useEvents(){
  return useContext(EventContext)
}

