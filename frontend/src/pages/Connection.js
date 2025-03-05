import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Connection() {
  const [qrCode, setQrCode] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const res = await axios.get('http://10.11.10.10:5000/api/qr');
        setQrCode(res.data.qr);
        setError(null);
      } catch (err) {
        setError('Failed to fetch QR: ' + err.message);
      }
    };

    const checkStatus = async () => {
      try {
        const res = await axios.get('http://10.11.10.10:5000/api/status');
        setIsConnected(res.data.ready);
      } catch (err) {
        console.error('Status check failed:', err);
      }
    };

    fetchQR();
    const interval = setInterval(checkStatus, 2000); // Cek status setiap 2 detik
    return () => clearInterval(interval); // Bersihkan interval saat komponen unmount
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Scan QR Code</h1>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : isConnected ? (
          <p className="text-green-500 text-center">WhatsApp Connected!</p>
        ) : qrCode ? (
          <img src={qrCode} alt="QR Code" className="w-64 h-64 mx-auto" />
        ) : (
          <p className="text-gray-500 text-center">Loading QR Code...</p>
        )}
      </div>
    </div>
  );
}

export default Connection;