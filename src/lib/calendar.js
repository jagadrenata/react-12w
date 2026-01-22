function generateCalendar12Weeks(year, month, date) {
  let calendar = []
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  
  let currentDate = new Date(year, month - 1, date);
  const day = (currentDate.getDay() + 6) % 7
  currentDate.setDate(currentDate.getDate() - day)
  
  for(let i =1; i <= 12; i++){
    let week =[]
    for(let w = 0; w < 7; w++) {
      week.push({
        date: currentDate.getDate(),
        day: currentDate.getDay(),
        dayString: weekday[currentDate.getDay()],
        week: week.length +1,
        month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear()
        
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }
    calendar.push(week)
  }
  return calendar
  
  
}


const calendar = generateCalendar12Weeks(2025, 12, 22)
export default calendar