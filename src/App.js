import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventPage from "./pages/event";
import TestPage from "./pages/test";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/:eventId" element={<EventPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
