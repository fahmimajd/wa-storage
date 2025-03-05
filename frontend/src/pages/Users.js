import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
        const res = await axios.get('http://10.11.10.10:5000/api/users');
        setUsers(res.data);
        setError(null);
    } catch (err) {
        setError('Failed to fetch users: ' + err.message);
    }
};

  const addUser = async () => {
    try {
      console.log('Adding user:', newUser); // Log data yang dikirim
      const res = await axios.post('http://10.11.10.10:5000/api/users', newUser);
      console.log('Response from backend:', res.data); // Log respons
      fetchUsers(); // Refresh daftar user
      setNewUser({ username: '', password: '', role: 'user' });
      setError(null);
    } catch (err) {
      setError('Failed to add user: ' + err.message);
      console.error('Add user error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Users</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-6 space-y-4">
          <input
            type="text"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={addUser}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Add User
          </button>
        </div>
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="p-3 bg-gray-50 rounded-lg">
              {user.username} - {user.role}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Users;