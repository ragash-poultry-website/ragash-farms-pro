import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [availability, setAvailability] = useState({});
  const [bookings, setBookings] = useState([]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'RagashSecure2025!') setLoggedIn(true);
  };

  const loadBookings = () => {
    fetch(`/api/bookings?password=${password}`)
      .then(res => res.json())
      .then(data => setBookings(data));
  };

  const saveAvailability = () => {
    fetch('/api/availability', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, ...availability })
    }).then(() => alert('✅ Availability updated!'));
  };

  useEffect(() => {
    if (loggedIn) {
      fetch('/api/availability').then(res => res.json()).then(setAvailability);
      loadBookings();
    }
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg mb-3"
            placeholder="Password"
          />
          <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-green-800 mb-6">Admin Dashboard</h2>
      
      {/* Availability Toggles */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h3 className="text-xl font-bold mb-4">Product Availability</h3>
        {Object.entries(availability).map(([key, val]) => (
          <label key={key} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={val}
              onChange={e => setAvailability({...availability, [key]: e.target.checked})}
              className="mr-3 h-5 w-5"
            />
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
        ))}
        <button onClick={saveAvailability} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg">
          Save Changes
        </button>
      </div>

      {/* Bookings */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4">Recent Bookings</h3>
        {bookings.map(b => (
          <div key={b._id} className="border-b py-3">
            <strong>{b.name}</strong> • {b.phone}<br/>
            {b.quantity} × {b.product} • Pickup: {new Date(b.pickupDate).toLocaleDateString()}
          </div>
        ))}
      </div>
    </div>
  );
}