import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [availability, setAvailability] = useState({});
  const [formData, setFormData] = useState({
    name: '', phone: '', product: '', quantity: '', pickupDate: ''
  });

  const navigate = useNavigate();

  // Fetch availability
  useEffect(() => {
    fetch('/api/availability')
      .then(res => res.json())
      .then(data => setAvailability(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const result = await res.json();
    if (result.success) {
      navigate('/success', { state: { name: formData.name } });
    } else {
      alert('❌ Booking failed: ' + result.error);
    }
  };

  // Product info
  const productInfo = {
    frozenBirds: { name: 'Frozen Birds', price: '₦6,000/kg', min: 2 },
    liveBirds: { name: 'Live Birds', price: '₦6,000 – ₦30,000', min: 5 },
    processedChicken: { name: 'Processed Chicken', price: '₦5,000/kg', min: 2 },
    organicEggs: { name: 'Organic Eggs', price: '₦800–₦1,000/crate', min: 1, max: 5 }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Step 1: Product */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-green-800 mb-4">1. Select Product</h2>
          <select 
            value={formData.product} 
            onChange={e => setFormData({...formData, product: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="">-- Choose Product --</option>
            {availability.frozenBirds && <option value="frozenBirds">Frozen Birds (₦6,000/kg, min 2kg)</option>}
            {availability.liveBirds && <option value="liveBirds">Live Birds (₦6,000 – ₦30,000)</option>}
            {availability.processedChicken && <option value="processedChicken">Processed Chicken (₦5,000/kg, min 2kg)</option>}
            {availability.organicEggs && <option value="organicEggs">Organic Eggs (₦800–₦1,000/crate, max 5/day)</option>}
          </select>
          <button 
            onClick={() => formData.product && setStep(2)} 
            className="mt-4 w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-green-800 mb-4">2. Your Details</h2>
          <input 
            placeholder="Full Name" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3"
          />
          <input 
            placeholder="Phone (e.g., +234 813 857 0933)" 
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3"
          />
          <input 
            type="number" 
            placeholder="Quantity" 
            value={formData.quantity}
            onChange={e => setFormData({...formData, quantity: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3"
          />
          <input 
            type="date" 
            value={formData.pickupDate}
            onChange={e => setFormData({...formData, pickupDate: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          />
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <strong>📍 Pickup Instructions:</strong><br/>
            Come to Ragash Farms, Igbiracamp. Call on arrival. Bring crates/coolers.
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-300 rounded-lg">Back</button>
            <button onClick={() => setStep(3)} className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-bold">Review</button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">3. Confirm Booking</h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p><strong>Product:</strong> {productInfo[formData.product]?.name}</p>
            <p><strong>Quantity:</strong> {formData.quantity}</p>
            <p><strong>Pickup:</strong> {formData.pickupDate}</p>
          </div>
          <button onClick={handleSubmit} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg">
            ✅ Submit Booking
          </button>
        </div>
      )}
    </div>
  );
}