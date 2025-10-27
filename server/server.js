const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ragash:secure123@cluster0.xxxxx.mongodb.net/ragashfarms?retryWrites=true&w=majority')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ DB Error:', err));

// Schemas
const bookingSchema = new mongoose.Schema({
  name: String,
  phone: String,
  product: String,
  quantity: Number,
  pickupDate: Date,
  timestamp: { type: Date, default: Date.now }
});

const availabilitySchema = new mongoose.Schema({
  products: {
    frozenBirds: { type: Boolean, default: true },
    liveBirds: { type: Boolean, default: true },
    processedChicken: { type: Boolean, default: true },
    organicEggs: { type: Boolean, default: true }
  },
  liveBirdPrices: { type: [String], default: ["₦6,000", "₦12,000", "₦20,000", "₦30,000"] }
});

const Booking = mongoose.model('Booking', bookingSchema);
const Availability = mongoose.model('Availability', availabilitySchema);

// Initialize availability
Availability.findOne().then(doc => {
  if (!doc) new Availability().save();
});

// Routes
app.post('/api/book', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json({ success: true, message: 'Booking received!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/availability', async (req, res) => {
  const avail = await Availability.findOne();
  res.json(avail.products);
});

app.put('/api/availability', async (req, res) => {
  const { password, ...update } = req.body;
  if (password !== 'RagashSecure2025!') return res.status(401).json({ error: 'Unauthorized' });
  await Availability.updateOne({}, { $set: { products: update } });
  res.json({ success: true });
});

app.get('/api/bookings', async (req, res) => {
  if (req.query.password !== 'RagashSecure2025!') return res.status(401).json({ error: 'Unauthorized' });
  const bookings = await Booking.find().sort({ timestamp: -1 });
  res.json(bookings);
});

// Serve React App
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));