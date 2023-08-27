import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GallerySelector from './components/GallerySelector';
import UnsplashGallery from './components/GalleryRoom';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GallerySelector />} />
        <Route path="/gallery/:room" element={<UnsplashGallery />} />
      </Routes>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));


