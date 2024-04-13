const mongoose = require('mongoose');

// News Item Subdocument Schema
const NewsItemSchema = new mongoose.Schema({
  gid: String,
  title: String,
  url: String,
  is_external_url: Boolean,
  author: String,
  contents: String,
  feedlabel: String,
  date: { type: Date, default: Date.now }, // Adjust for timestamp
  feedname: String,
  feed_type: Number,
  appid: Number // Include appid for context
});

// News Model Schema
const NewsSchema = new mongoose.Schema({
  appid: { type: Number, required: true },
  newsitems: [NewsItemSchema],
  count: Number
});

// Achievement Subdocument Schema
const AchievementSchema = new mongoose.Schema({
  name: String,
  percent: Number
});

// Global Achievement Model Schema
const GlobalAchievementSchema = new mongoose.Schema({
  gameid: { type: Number, required: true },
  achievements: [AchievementSchema]
});


const AvatarSchema = new mongoose.Schema({
  url: String // Store the avatar as a URL string
});
const PlayerSummarySchema = new mongoose.Schema({
  steamid: { type: String, required: true },
  communityvisibilitystate: Number,
  profilestate: Number,
  personaname: String,
  commentpermission: Boolean,
  profileurl: String,
  avatar: {
    small: String, // For avatar
    medium: String, // For avatarmedium
    full: String // For avatarfull
  },
  avatarhash: String,
  lastlogoff: Date,
  personastate: Number,
  realname: String,
  primaryclanid: String,
  timecreated: Date,
  personastateflags: Number,
  loccountrycode: String,
  locstatecode: String,
  loccityid: Number
});


// Game Subdocument Schema (used for OwnedGames and RecentlyPlayedGames)
const GameSchema = new mongoose.Schema({
  appid: {type: String,default : ""},
  name: String, // Add the 'name' field
  playtime_forever: {type: Number,default : 0},
  playtime_2weeks: { type: Number, default: 0 },
  // Additional fields for more detailed game information
  playtime_windows_forever: {type: Number,default : 0},
  playtime_mac_forever: {type: Number,default : 0},
  playtime_linux_forever: {type: Number,default : 0},
  playtime_deck_forever: {type: Number,default : 0},
  rtime_last_played: { type: Date, default: Date.now },
  playtime_disconnected: {type: Number,default : 0},
  img_icon_url: {type: String,default : ""},
});

// Owned Games Model Schema
const OwnedGamesSchema = new mongoose.Schema({
  steamid: { type: String, required: true },
  game_count: Number,
  games: [GameSchema]
});

// Recently Played Games Model Schema
const RecentlyPlayedGamesSchema = new mongoose.Schema({
  steamid: { type: String, required: true },
  total_count: Number,
  games: [GameSchema] // Reusing the GameSchema
});

// Compiling models from the above schemas
const News = mongoose.model('News', NewsSchema);
const GlobalAchievement = mongoose.model('GlobalAchievement', GlobalAchievementSchema);
const PlayerSummary = mongoose.model('PlayerSummary', PlayerSummarySchema);
const OwnedGames = mongoose.model('OwnedGames', OwnedGamesSchema);
const RecentlyPlayedGames = mongoose.model('RecentlyPlayedGames', RecentlyPlayedGamesSchema);

// Export the models
module.exports = {
  News,
  GlobalAchievement,
  PlayerSummary,
  OwnedGames,
  RecentlyPlayedGames
};
