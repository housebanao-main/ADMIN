require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/boq', require('./routes/boqRoutes')); // Ensure this route is correct
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/partners', require('./routes/partnerRoutes'));
app.use('/api/admins', require('./routes/adminRoutes'));
app.use('/api/transports', require('./routes/transportRoutes'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
