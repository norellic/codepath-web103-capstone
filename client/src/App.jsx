// client/src/App.jsx

import { Routes, Route, Link } from "react-router-dom";
import { useState } from "react";

// Pages
import Home from "./pages/Home.jsx";
import Habits from "./pages/Habits.jsx";
import HabitDetail from "./pages/HabitDetail.jsx";
import EditHabit from "./pages/EditHabit.jsx";
import TimerView from "./pages/TimerView.jsx";
import FinishedTimerView from "./pages/FinishedTimerView.jsx";
import StickerGallery from "./pages/StickerGallery.jsx";
import { useUser } from "./UserContext.jsx";
import infoIcon from "../assets/info.svg";

// Styles
import "./Global.css";
import "./components/Header.css";
import "./components/Modal.css";

function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>

        <h2>About Beam</h2>
        <p>
          This app helps you build habits, complete timed sessions, and earn
          points to unlock stickers in the gallery.
        </p>

        <ul>
          <li>Track and manage habits</li>
          <li>Start timers for focused sessions</li>
          <li>Earn points and redeem stickers</li>
        </ul>
      </div>
    </div>
  );
}

function Header({ onOpenInfo }) {
  const { points } = useUser();

  return (
    <header className="header">
      <nav className="nav-group">
        <Link to="/"><button className="nav-link-btn">HOME</button></Link>
        <Link to="/habits"><button className="nav-link-btn">MY HABITS</button></Link>
        <Link to="/stickers"><button className="nav-link-btn">STICKER GALLERY</button></Link>
      </nav>

      
      <div className="nav-group">
        <div className="points">Points: {points}</div>
        <button className="icon-btn" onClick={onOpenInfo}>
          <img src={infoIcon} alt="Info" className="info-icon" />
        </button>

      </div>
    </header>
  );
}

export default function App() {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <>
      <div className="app-surface">

        <Header onOpenInfo={() => setIsInfoOpen(true)} />

        <div className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/habit/:id" element={<HabitDetail />} />
            <Route path="/habit/:id/edit" element={<EditHabit />} />
            <Route path="/habit/:id/timer" element={<TimerView />} />
            <Route path="/habit/:id/finished" element={<FinishedTimerView />} />
            <Route path="/stickers" element={<StickerGallery />} />
          </Routes>
        </div>

        <InfoModal
          isOpen={isInfoOpen}
          onClose={() => setIsInfoOpen(false)}
        />
        
      </div>
    </>
  );
}
