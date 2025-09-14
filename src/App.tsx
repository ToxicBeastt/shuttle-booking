import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PassengerPage from './pages/PassengerPage';
import BookingsPage from './pages/BookingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PassengerPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
      </Routes>
    </Router>
  );
}

export default App
