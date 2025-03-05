import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Welcome({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Arahkan ke /files setelah 3 detik
    const timer = setTimeout(() => {
      navigate('/files');
    }, 3000);
    return () => clearTimeout(timer); // Bersihkan timer saat komponen unmount
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user.username}!</h1>
        <p className="text-gray-600 mb-4">
          You have successfully logged in as <span className="font-semibold">{user.role}</span>.
        </p>
        <p className="text-gray-500">Redirecting to Files in 3 seconds...</p>
      </div>
    </div>
  );
}

export default Welcome;