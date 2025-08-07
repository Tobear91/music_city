const express = require("express");
const router = express.Router();

const spotifyPreviewFinder = require('spotify-preview-finder');
const { getRandomSeries } = require("../modules/tmdb");

router.get('/randomshow',async (req,res)=>{
    const series = [];
    for (let cpt =0; cpt < 5; cpt ++){
        series.push(await getRandomSeries())
    }
    res.json({series});

})

router.post('/previewUrl', async (req,res)=>{
    const artistName = req.body.artistName;
    const trackName = req.body.trackName;

    const result = await spotifyPreviewFinder(trackName,artistName, 1);
    res.json({result:true, previewUrl : result.results[0].previewUrls[0]})
})

module.exports = router;
