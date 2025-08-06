const express = require("express");
const router = express.Router();

const spotifyPreviewFinder = require('spotify-preview-finder');
const { getRandomSeries } = require("../modules/tmdb");



router.get('/randomshow',async (req,res)=>{
    
    let result = await getRandomSeries();
    res.json({result})

})



module.exports = router;
