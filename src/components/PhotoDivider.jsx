import React from 'react';

export default function PhotoDivider({ image = "/assets/divisoria1.png" }) {
  return (
    <div 
      style={{
        width: '100%',
        height: '360px',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 25%',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }} 
    />
  );
}
