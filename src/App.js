import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import PlayerSummaryDisplay from './components/PlayerSummaryDisplay';
import NewsDisplay from './components/NewsItem';
import GameCard  from "./components/GameCard";
import Navbar from './components/Navbar';
// ... other display components
//curently using the index.html file in the public folder to display the app
function App() {
  return (

      <BrowserRouter>
        <div>
            <Navbar/>
          <SearchForm />
          <Routes>
            <Route path="/news/:appid" element={<NewsDisplay />} />
            <Route path="/player/:steamid" element={<PlayerSummaryDisplay />} />
            <Route path="/game/:appid" element={<GameCard />} />
            {/* ... routes for other display components */}
          </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;
