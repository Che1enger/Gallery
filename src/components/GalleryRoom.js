import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './UnsplashGallery.css';
import { motion } from 'framer-motion';
import rooms from './api'


function getRandomPosition(existingPositions) {
  const maxX = 3500 - 250; // Ширина контейнера минус ширина изображения
  const maxY = 600 - 350; // Высота контейнера минус высота изображения

  let newPosition;
  do {
    newPosition = {
      x: Math.random() * maxX,
      y: Math.random() * maxY,
    };
  } while (existingPositions.some(pos => distanceBetween(pos, newPosition) < 20));

  return newPosition;
}

function distanceBetween(pos1, pos2) {
  return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);
}

function getRandomIndex(maxIndex) {
  return Math.floor(Math.random() * maxIndex);
}

const UnsplashGallery = () => {
  const { room } = useParams();
  console.log('Room param from URL:', room);
  const [images, setImages] = useState([]);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    const fetchArtImages = async () => {
      try {
        console.log('Selected room:', room); // Debug output to check the value of 'room'
        const selectedRoom = rooms.find(r => r.id === parseInt(room));

        if (!selectedRoom) {
          console.error('Selected room not found');
          return;
        }
    
        const response = await axios.get('https://api.unsplash.com/search/photos', {
          params: {
            client_id: 'JyuGt0QaZ3oxhltWy2aEyz06MySSOaqhmJYHIeqkkPM',
            per_page: 50,
            page: 1,
            orientation: 'portrait',
            query: selectedRoom.query, // Use the query from the selected room
          }
        });
        console.log('Selected room query:', selectedRoom.query);
        setImages(response.data.results);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
  
    fetchArtImages();
  }, [room]);

  useEffect(() => {
    const handleScroll = e => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        document.querySelector('.image-outer-container').scrollLeft += e.deltaY;
      }
    };

    document.querySelector('.image-outer-container').addEventListener('wheel', handleScroll);

  }, []);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (index) => {
    setSelectedImage(images[index]);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };


  useEffect(() => {
    const imageContainer = imageContainerRef.current;
    const imageElements = imageContainer.querySelectorAll('.image');

    const imagePositions = Array.from(imageElements).map(() => getRandomPosition([]));
    
    imageElements.forEach((image, index) => {
      const { x, y } = imagePositions[index];
      image.style.left = `${x}px`;
      image.style.top = `${y}px`;
    });
  }, [images]);

  return (
    <div className="unsplash-gallery">
      <h2 className='roomTitle'>Галерея зала {room && rooms.find(r => r.id === parseInt(room))?.name}</h2>

      <div className="image-outer-container">
        
        <div className="image-container" ref={imageContainerRef}>
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="image"
              style={{
                backgroundImage: `url(${image.urls.small})`,
                position: 'absolute',
                width: '150px',
                height: '250px',
                left: '0', 
                top: '0',
              }}
              initial={{ opacity: 0, scale: 1 }} 
              animate={{ opacity: 1, scale: 1 }} 
              whileHover={{ scale: 1.4, zIndex: 2 }} 
              transition={{ opacity: { duration: 0.9 }, scale: { duration: 0.1 } }} 
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>
        {selectedImage && (
        <div className="fullscreen-image-overlay" onClick={handleCloseImage}>
          <img
            src={selectedImage.urls.regular}
            alt="Fullsize"
            style={{
              position: 'fixed',
              top: '46%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '37%',   // Уменьшение ширины изображения
              height: '90%',  // Уменьшение высоты изображения
              zIndex: 1000,
            }}
          />
          <div className="author-name">
            Автор: {selectedImage.user.name}
          </div>
          <div
            className="fullscreen-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              zIndex: 997,
            }}
          />
        </div>
      )}
      </div>
    </div>
  );
};

export default UnsplashGallery;