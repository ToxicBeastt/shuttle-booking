import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PassengerPage from "./pages/PassengerPage";
import BookingsPage from "./pages/BookingsPage";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
      {/* Full height flex container */}
      <div className="flex h-screen w-screen bg-gray-50">
        {/* Sidebar with responsive width */}
        <div className="w-48 md:w-64 h-full">
          <Sidebar />
        </div>

        {/* Main content takes the rest */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<PassengerPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
