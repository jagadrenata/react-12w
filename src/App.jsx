import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import TeamMaker from './pages/w6/TeamMaker';


export default function App() {
  return (
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<TeamMaker />} />
          </Routes>
      </BrowserRouter>
  );
}