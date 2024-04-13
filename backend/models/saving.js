const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan'); // Make sure to require morgan
require('dotenv').config();
const axios = require('axios');
const { News, GlobalAchievement, PlayerSummary, OwnedGames, RecentlyPlayedGames } = require('./models/models'); // Import your models
const { request } = require('express');

// Initialize express app
const app = express();

// Use morgan middleware for logging
app.use(morgan('dev')); // Logs requests to the console in development mode

const MONGO_URI = "mongodb+srv://i221698:X63pW6lCx5AmQ1I0@cluster0.63jxjj8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your actual URI

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB database connection established successfully'))
    .catch(error => console.error('MongoDB connection error:', error));



function generateFakeNewsItem() {
    return {
        gid: Math.random().toString(36).substring(2), // Random ID
        title: 'Sample News Title ' + Math.floor(Math.random() * 100),
        url: 'https://example.com/news/' + Math.floor(Math.random() * 100),
        is_external_url: Math.random() < 0.5, // Random boolean
        author: 'Author Name',
        contents: 'Sample news content. Lorem ipsum dolor sit amet...',
        feedlabel: 'News Feed',
        date: new Date(),
        feedname: 'Sample Feed',
        feed_type: 1
    };
}
app.post('/news', async (req, res) => {
    try {
        // Generate some fake news items
        const fakeNewsData = [
            generateFakeNewsItem(),
            generateFakeNewsItem(),
            generateFakeNewsItem()
        ];

        // Create a new News document (no need to find an existing one)
        const newsDocument = new News({
            appid: 123, // You can set an appid if needed, otherwise remove this line
            newsitems: fakeNewsData,
            count: fakeNewsData.length
        });

        // Save the news document to the database
        const savedNews = await newsDocument.save();

        res.status(201).json({ message: "News items added successfully", news: savedNews });
    } catch (error) {
        console.error('Error adding dummy news: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/news', async (req, res) => {
    try {
        const newsData = await News.find();
        res.json(newsData);
    } catch (err) {
        res.status(500).json({ message: err.message || 'Internal Server Error' });
    }
});


app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*'); // Be cautious with CORS in production
    next();
});
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message || 'Internal Server Error' });
});


// Other routes would follow a similar pattern, fetching different types of data and saving it to their respective collections
app.get('*', (request, response) => {
    response.status(404).json({ message: 'Not Found' });
});
// Generic error handler - this should be the last middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});