const express = require("express");
const router = express.Router();

const spotifyPreviewFinder = require('spotify-preview-finder');
const { getRandomSeries } = require("../modules/tmdb");

// const Track = require('../models/tracks');
const Show = require('../models/blindtests/shows')

router.get('/randomshow',async (req,res)=>{
    const series = [];
    for (let cpt =0; cpt < 10; cpt ++){
        series.push(await getRandomSeries())
    }
    res.json({series});
})


router.post('/previewUrl', async (req, res) => {
  try {
    const artistName = req.body.artistName;
    const trackName = req.body.trackName;

    const result = await spotifyPreviewFinder(trackName, artistName, 1);

    if (!result || !result.results || !result.results[0] || !result.results[0].previewUrls || result.results[0].previewUrls.length === 0) {
      return res.json({ result: false, previewUrl: null });
    }
    res.json({ result: true, previewUrl: result.results[0].previewUrls[0] });
  } catch (error) {
    console.error("Erreur dans /previewUrl :", error);
    res.status(500).json({ result: false, error: "Erreur serveur" });
  }
});



router.post('/newSerie',async(req,res)=>{
    const serieId = req.params.serieId;
    
    const isShowSaved = await Show.findOne({ tmbdId: serieId});
    if(isShowSaved===null){
        const newShow = new Show({
            type:req.params.type, 
            tmbdId: req.params.id, 
            name: req.params.title,
            posterPath: req.params.posterPath,
            mainActor:req.params.mainActor,
            platform:req.params.platform,
            soundtrackName:req.params.soundtrack,
            soundtrackArtist:req.params.artistName,
            soundtrackPreview:req.params.previewUrl,
            soundtrackSpotifyId:req.params.trackId,
            isPreviewCetain: req.params.isTrackMatchCertain,
        })
        
        const showSaved = await newShow.save()
        res.json({result: true, show: showSaved })
    }else {
			// City already exists in database
			res.json({ result: false, error: 'show already saved' });
		}
})


router.post('/saveResults',(req,res)=>{
    
})



module.exports = router;
