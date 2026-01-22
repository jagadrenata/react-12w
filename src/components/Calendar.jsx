import { useState, useEffect } from 'react'
import calendar from '../lib/calendar.js'

export default function Calendar({cal, setCal, date, setDate}) {
  useEffect(() => {
    setCal(calendar)
  })
  
  return (
    <div>
      {cal && cal.map((ca, index) => {
        return(
          <div key={index} className="flex p-3 gap-3">
            {ca && ca.map((c, idx) => {
            let isNow = c.date === date.getDate() && c.month === (date.getMonth() +1)
            
             return(
              <div key={idx} onClick={() => setDate(new Date(new Date().getFullYear(), c.month - 1, c.date))} className={`relative grid grid-cols-2 grid-rows-2 w-20 aspect-square text-gray-400 ${isNow ? "bg-orange-500 text-white" : ""}`}>
                <div className="border-1"></div>
                <div className="border-1"></div>
                <div className="border-1"></div>
                <div className="border-1"></div>
                
                <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-7 h-7 bg-white text-black border-1 flex justify-center items-center">
                  <h3 className="">{c.date}</h3>
                </div>
              </div>
             )
            })}
          </div>
        )
      })}
    </div>
    
  )
}