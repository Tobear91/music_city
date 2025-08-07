const express = require("express");
const router = express.Router();
const Discogs = require("disconnect").Client;
const discogs = require("../modules/discogs.js");

const DISCOGS_KEY = process.env.DISCOGS_KEY;
const DISCOGS_SECRET = process.env.DISCOGS_SECRET;
const DISCOGS_REDIRECT_URI = process.env.DISCOGS_REDIRECT_URI;

router.get("/authorize", function (req, res) {
  try {
    const oAuth = new Discogs().oauth();

    oAuth.getRequestToken(DISCOGS_KEY, DISCOGS_SECRET, DISCOGS_REDIRECT_URI, function (err, requestData) {
      req.session.requestData = requestData;
      // req.session.email = req.query.email;
      const authorize_url = requestData.authorizeUrl;
      res.json({ result: true, authorize_url });
    });
  } catch (error) {
    next(error);
  }
});

router.get("/callback", async (req, res) => {
  try {
    console.log("requestData", req.session.requestData);
    const oAuth = new Discogs(req.session.requestData).oauth();

    oAuth.getAccessToken(req.query.oauth_verifier, async function (err, accessData) {
      req.session.accessData = accessData;
      // await discogs.saveAccessData(req.session.email, accessData);

      const encoded = Buffer.from(JSON.stringify({ connected: true })).toString("base64");
      res.redirect(`http://127.0.0.1:3001/vinyles-store/connexion?discogs=${encoded}`);
    });
  } catch (error) {
    next(error);
  }
});

router.get("/identity", async (req, res) => {
  try {
    const dis = new Discogs(req.session.accessData);
    dis.getIdentity(function (err, datas) {
      res.json({ result: true, identity: datas });
    });
  } catch (error) {
    next(error);
  }
});

router.get("/users/:username/wantlist", async (req, res) => {
  try {
    const dis = new Discogs(req.session.accessData);
    const wantlist = dis.user().wantlist();
    const releases = await wantlist.getReleases(req.params.username);
    res.json({ result: true, wantlist: releases });
  } catch (error) {
    next(error);
  }
});

router.delete("/users/:username/wants/:release_id", async (req, res) => {
  try {
    const dis = new Discogs(req.session.accessData);
    const wantlist = dis.user().wantlist();
    await wantlist.removeRelease(req.params.username, req.params.release_id);
    res.json({ result: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
