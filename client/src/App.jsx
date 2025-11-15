import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Habits from './pages/Habits';
import StickerGallery from './pages/StickerGallery';
// import HabitDetail from './pages/HabitDetail.jsx';       // will create
// import TimerView from './pages/TimerView.jsx';           // will create
// import FinishedTimerView from './pages/FinishedTimerView.jsx'; // will create

const App = () => {

  return (
    <div>
      {/* Navigation buttons */}
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Link to="/">
          <button>Home</button>
        </Link>
        <Link to="/habits">
          <button>My Habits</button>
        </Link>
        <Link to="/stickerGallery">
          <button>Sticker Gallery</button>
        </Link>
      </nav>

      {/* Define the routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/stickerGallery" element={<StickerGallery />} />
        {/* <Route path="/habit/:id" element={<HabitDetail />} />
        <Route path="/habit/:id/timer" element={<TimerView />} />
        <Route path="/habit/:id/finished" element={<FinishedTimerView />} /> */}
      </Routes>
    </div>
  );
}

export default App