const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    appid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
    // Add additional fields based on your CSV file structure
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;