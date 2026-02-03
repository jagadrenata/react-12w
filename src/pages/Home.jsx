import { useState, useEffect } from 'react'
import Calendar from "../components/Calendar"
import Notes from "../components/Notes"
import Schedule from "../components/Schedule"
import LoginAuth from "../components/LoginAuth"

export default function Home() {
  const [cal, setCal] = useState(null)
  const [notes, setNotes] = useState([])
  const [date, setDate] = useState(null)
  
  useEffect(() => {
    setDate(new Date())
  }, [])
  return (
    <>
      <LoginAuth/>
      <div className="grid md:grid-cols-2 container mx-auto">
        <Calendar cal={cal} setCal={setCal} date={date} setDate={setDate}/>
        <div>
          <Notes notes={notes} setNotes={setNotes} date={date}/>  
          <Schedule date={date}/>
        </div>
      </div>
    </>
  )
}
