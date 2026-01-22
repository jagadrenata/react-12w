import React, { useState, useEffect} from 'react'

export default function Notes({ notes, setNotes, date}) {
  const [formData, setFormData] = useState({
    date: new Date(),
    title: "hello",
    note: "notes"
  })
  const [isNow, setIsNow] = useState(false)
  
  useEffect(() => {
    setNotes(JSON.parse(localStorage.getItem("notes")))
    if(date) {
    setIsNow(date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth())
    }
    
  }, [date])
  
  
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({...formData, [name] : value})
  }
  const handleSubmit =() => {
    localStorage.setItem('notes',  JSON.stringify([...notes, formData]))
  }
  return (
    <div className="">
      {notes && notes.filter(n => new Date(n.date).getDate() === date.getDate() && new Date(n.date).getMonth() === date.getMonth()).length === 0 ? (
        <div className="text-center text-gray-500 py-8">Data tidak ditemukan</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {notes && notes.filter(n => new Date(n.date).getDate() === date.getDate() && new Date(n.date).getMonth() === date.getMonth()).map((note, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <div className="text-sm text-gray-500 mb-2">{new Date(note.date).toLocaleString()}</div>
              <h3 className="text-lg font-bold mb-2">{note.title}</h3>
              <p className="text-gray-700">{note.note}</p>
            </div>
          ))}
        </div>
      )}
      {isNow && (
        <form className="bg-white p-4 rounded shadow mt-8" onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              className="w-full p-2 border-2 border-gray-300 rounded"
              type="text"
              name="title"
              onChange={handleChange}
              value={formData.title}
              placeholder="Judul"
            />
          </div>
          <div className="mb-4">
            <textarea
              className="w-full p-2 border-2 border-gray-300 rounded"
              name="note"
              onChange={handleChange}
              value={formData.note}
              rows="3"
              placeholder="Catatan"
            />
          </div>
          <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded" type="submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );

  
}