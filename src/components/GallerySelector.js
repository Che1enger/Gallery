import React from 'react';
import { Link } from 'react-router-dom';
import './GallerySelector.css'
import rooms from './api'


const GallerySelector = () => {
  

  return (
    <div className="gallery-selector">
      
      <div className="column-container">
        {rooms.map(room => (
          <div className="column" key={room.id}>
           <Link to={`/gallery/${room.id}`} className="link" style={{ backgroundImage: `url(${rooms[room.id - 1].background})` }}>
            {room.name}
          </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GallerySelector;


