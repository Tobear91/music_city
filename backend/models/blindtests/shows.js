const mongoose = require("mongoose");


const showSchema = mongoose.Schema(
  {
    type:String, // movie or serie
    tmbdId: Number, //id on TMDB
    name: String,
    posterPath: String,
    mainActor:String,
    platform:String,
    soundtrackName:String,
    soundtrackArtist:String,
    soundtrackPreview:String,
    soundtrackSpotifyId:String,
    isPreviewCertain: Boolean,
  },
)


const Show = mongoose.model("shows", showSchema);

module.exports = Show;