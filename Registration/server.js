const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/registrationDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define User schema and model
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const newUser = new User({ email, password });
        await newUser.save();
        res.json({ success: true, message: 'User registered successfully.' });
    } catch (err) {
        console.error('Error saving user:', err);
        let errorMessage = 'Error saving user to database.';
        if (err.code === 11000) { // Duplicate key error code
            errorMessage = 'Email already exists.';
        }
        res.json({ success: false, message: errorMessage });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

