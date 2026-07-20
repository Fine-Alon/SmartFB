import React from 'react';

const QRCodeDisplay = ({ base64QrCode }) => {
  if (!base64QrCode) return null;

  return (
    <img 
      // This prefix is required by the browser to render the Base64 string as an image
      src={`data:image/png;base64,${base64QrCode}`} 
      alt="Survey QR Code" 
      className="w-32 h-32 mx-auto"
    />
  );
};

export default QRCodeDisplay;