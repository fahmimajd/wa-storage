import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ number: '', name: '' });
  const [error, setError] = useState(null);

  const fetchContacts = async () => {
    try {
      const res = await axios.get('http://10.11.10.10:5000/api/contacts');
      setContacts(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch contacts: ' + err.message);
    }
  };
  
  const addContact = async () => {
    try {
      await axios.post('http://10.11.10.10:5000/api/contacts', newContact);
      fetchContacts();
      setNewContact({ number: '', name: '' });
    } catch (err) {
      setError('Failed to add contact: ' + err.message);
    }
  };
  // Tambahkan {error && <p className="text-red-500 mb-4">{error}</p>} di return

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Contacts</h1>
        <div className="mb-6 space-y-4">
          <input
            type="text"
            value={newContact.number}
            onChange={(e) => setNewContact({ ...newContact, number: e.target.value })}
            placeholder="Number (e.g., 628123456789)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            placeholder="Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={addContact}
            className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            Add Contact
          </button>
        </div>
        <ul className="space-y-2">
          {contacts.map((contact) => (
            <li key={contact.id} className="p-3 bg-gray-50 rounded-lg">
              {contact.name} - {contact.sender_number}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Contacts;