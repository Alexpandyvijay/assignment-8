const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Player = new Schema({
        player_id : String,
        age : Number,
        country : String, 
        installed_days : Number, 
        coins : Number, 
        gems : Number, 
        game_level : Number, 
        purchaser : Boolean,
        password : String
});

const PlayerInfo = mongoose.model('players',Player);

module.exports = PlayerInfo;