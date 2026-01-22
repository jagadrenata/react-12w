import { schedule } from '../lib/SchoolSchedule.js';
import { useEffect } from 'react';

export default function Schedule({date}) {
  
  if(!date) {
    return "Schedule not found because date is null"
  }

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-4">Jadwal Pelajaran</h1>
      {schedule && schedule.filter(sche => sche.day === date.getDay()).map((sche, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Hari {getDayName(sche.day)}</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border border-gray-300">Waktu</th>
                <th className="px-4 py-2 border border-gray-300">Mata Pelajaran</th>
                <th className="px-4 py-2 border border-gray-300">Teacher Code</th>
                <th className="px-4 py-2 border border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {sche.sessions.map((session, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border border-gray-300">{session.timeSlot}</td>
                  <td className="px-4 py-2 border border-gray-300">{session.subject}</td>
                  <td className="px-4 py-2 border border-gray-300">{session.teacherCode}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <button className="py-1 px-2 rounded bg-orange-500 text-white">What i get?</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

const getDayName = (dayNumber) => {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  return days[dayNumber - 1];
};
