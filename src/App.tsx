import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PassengerPage from './pages/PassengerPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PassengerPage />} />
      </Routes>
    </Router>
  );
}

export default App
