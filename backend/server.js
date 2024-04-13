const express = require('express');
const cors = require('cors');
// Enables CORS for all routes

const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const morgan = require('morgan'); 
require('dotenv').config();
const axios = require('axios');
const { News, GlobalAchievement, PlayerSummary, OwnedGames, RecentlyPlayedGames } = require('./models/models'); // Imports
const Game = require('./models/Game'); 

const app = express();
app.use(cors());
//morgan middleware for logging
app.use(morgan('dev')); // Logs requests to the console in development mode

const MONGO_URI = "mongodb+srv://i221698:X63pW6lCx5AmQ1I0@cluster0.63jxjj8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB database connection established successfully'))
    .catch(error => console.error('MongoDB connection error:', error));


app.get('/search', async (req, res) => {
  console.log('Search route accessed!'); // debug
  const searchTerm = req.query.term;
  console.log('Server received search term:', searchTerm);
  try {
    // Now we only select the 'name' field
    const results = await Game.find({ name: new RegExp(searchTerm, 'i') }).select('name -_id').limit(10);

    // Transform the results to return an array of names
    const gameNames = results.map(game => game.name);

    res.json(gameNames);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Internal server error during search' });
  }
});


app.get('/fetchNews/:appid', async (req, res) => {
  const appid = req.params.appid;
  const url = `https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${appid}&count=3&format=json`;

  try {
    const response = await axios.get(url);
    const newsData = response.data.appnews.newsitems;

    // 1. Attempt to update an existing document
    const updatedNews = await News.findOneAndReplace(
        { appid },
        {
          appid,
          newsitems: newsData.map(item => ({
            ...item,
            date: new Date(item.date * 1000)
          })),
          count: newsData.length
        }
    );

    // 2. If nothing updated, create a new document
    if (!updatedNews) {
      const newNews = new News({
        appid,
        newsitems: newsData.map(item => ({
          ...item,
          date: new Date(item.date * 1000)
        })),
        count: newsData.length
      });
      await newNews.save();
      res.json(newNews);
    } else {
      res.json(updatedNews);
    }

  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/news', async (req, res) => {
  try {
    const newsData = await News.find();
    res.json(newsData);
  } catch (error) {
    console.error('Error fetching news from DB:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/fetchPlayerSummaries/:steamid', async (req, res) => {
  const steamid = req.params.steamid; // Ideally, get this dynamically from the request
  const apiKey = process.env.STEAM_API_KEY;
  const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamid}&format=json`;

  try {
    const response = await axios.get(url);
    const playerSummaryData = response.data.response.players[0];

    // 1. Attempt to update an existing document
    const updatedSummary = await PlayerSummary.findOneAndReplace(
        { steamid },
        playerSummaryData
    );

    // 2. If nothing updated, create a new document
    if (!updatedSummary) {
      const newPlayerSummary = new PlayerSummary(playerSummaryData);
      await newPlayerSummary.save();
      res.json(newPlayerSummary);
    } else {
      res.json(updatedSummary);
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/playerSummaries/:steamid', async (req, res) => {
  const steamid = req.params.steamid;

  try {
    const playerSummary = await PlayerSummary.findOne({ steamid });
    if (!playerSummary) {
      return res.status(404).json({ message: 'Player summary not found' });
    }
    res.json(playerSummary);
  } catch (error) {
    console.error('Error fetching player summaries from DB:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/fetchOwnedGames/:steamid', async (req, res) => {
  const steamid = req.params.steamid;
  const apiKey = process.env.STEAM_API_KEY;
  const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamid}&format=json`;
  try {
    const response = await axios.get(url);
    const ownedGamesData = response.data.response.games;

    // 1. Attempt to update an existing document
    const updatedGames = await OwnedGames.findOneAndReplace(
        { steamid },
        {
          steamid,
          games: ownedGamesData.map(game => ({
            ...game,
            rtime_last_played: game.rtime_last_played
                ? new Date(game.rtime_last_played * 1000)
                : null
          }))
        },
        { upsert: true, new: true }
    );

    // 2. If nothing updated, create a new document
    if (!updatedGames) {
      const newOwnedGames = new OwnedGames({
        steamid,
        games: ownedGamesData.map(game => ({
          ...game,
          rtime_last_played: game.rtime_last_played
              ? new Date(game.rtime_last_played * 1000)
              : null
        }))
      });
      await newOwnedGames.save();
      res.json(newOwnedGames);
    } else {
      res.json(updatedGames);
    }

  } catch (error) {
      console.error('Error fetching owned games:', error);

      // Enhanced Logging
      if (error.name === 'CastError') {
        console.error('Invalid rtime_last_played:', error.value);
      }

      res.status(500).json({ message: 'Internal server error' });
  }
});


// Fetch Owned Games
app.get('/ownedGames/:steamid', async (req, res) => {
  const steamid = req.params.steamid;

  try {
    const ownedGames = await OwnedGames.findOne({ steamid });
    if (!ownedGames) {
      return res.status(404).json({ message: 'Owned games not found' });
    }
    res.json(ownedGames);
  } catch (error) {
    console.error('Error fetching owned games from DB:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/fetchRecentlyPlayedGames/:steamid', async (req, res) => {
  const steamid = req.params.steamid;
  const apiKey = process.env.STEAM_API_KEY;
  const url = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamid}&format=json`;

  try {
    const response = await axios.get(url);
    const recentlyPlayedGamesData = response.data.response.games;

    // 1. Attempt to update an existing document
    const updatedGames = await RecentlyPlayedGames.findOneAndReplace(
        { steamid },
        { steamid, games: recentlyPlayedGamesData, total_count: recentlyPlayedGamesData.length }
    );

    // 2. If nothing updated, create a new document
    if (!updatedGames) {
      const newRecentlyPlayedGames = new RecentlyPlayedGames({
        steamid,
        games: recentlyPlayedGamesData,
        total_count: recentlyPlayedGamesData.length
      });
      await newRecentlyPlayedGames.save();
      res.json(newRecentlyPlayedGames); // Send the newly created data
    } else {
      res.json(updatedGames);
    }

  } catch (error) {
    console.error('Error fetching recently played games:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch Recently Played Games
app.get('/recentlyPlayedGames/:steamid', async (req, res) => {
  const steamid = req.params.steamid;

  try {
    const recentlyPlayedGames = await RecentlyPlayedGames.findOne({ steamid });
    if (!recentlyPlayedGames) {
      return res.status(404).json({ message: 'Recently played games not found' });
    }
    res.json(recentlyPlayedGames);
  } catch (error) {
    console.error('Error fetching recently played games from DB:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*'); 
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
// Generic error handler 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});