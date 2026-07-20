import React from 'react';

const QRCodeDisplay = ({ base64QrCode, title }) => {
  if (!base64QrCode) return <p>Generating QR Code...</p>;

  return (
    <div className="qr-container">
      <h3>{title || "Survey QR Code"}</h3>
      <img 
        src={`data:image/png;base64,${base64QrCode}`} 
        alt="Survey QR Code" 
        style={{ width: '250px', height: '250px', border: '1px solid #ccc' }} 
      />
    </div>
  );
};

export default QRCodeDisplay;