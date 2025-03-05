import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Connection from './pages/Connection';
import Files from './pages/Files';
import Contacts from './pages/Contacts';
import Users from './pages/Users';
import Login from './pages/Login';
import Welcome from './pages/Welcome';

function App() {
  const [user, setUser] = useState(null);

  const logout = () => {
    setUser(null);
  };

  // Komponen untuk proteksi rute
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) return <Navigate to="/login" />;
    if (!allowedRoles.includes(user.role)) return <Navigate to="/files" />;
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {user ? (
          <nav className="bg-blue-600 p-4 shadow-md">
            <ul className="flex space-x-6 justify-center text-white font-semibold">
              <li><Link to="/" className="hover:text-blue-200 transition">Connection</Link></li>
              <li><Link to="/files" className="hover:text-blue-200 transition">Files</Link></li>
              <li><Link to="/contacts" className="hover:text-blue-200 transition">Contacts</Link></li>
              {user.role === 'admin' && (
                <li><Link to="/users" className="hover:text-blue-200 transition">Users</Link></li>
              )}
              <li>
                <button onClick={logout} className="hover:text-blue-200 transition">
                  Logout ({user.username})
                </button>
              </li>
            </ul>
          </nav>
        ) : null}
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route
            path="/welcome"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <Welcome user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <Connection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/files"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <Files />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <Contacts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={user ? '/welcome' : '/login'} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;