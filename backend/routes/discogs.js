const Discogs = require("disconnect").Client;
const express = require("express");
const router = express.Router();

const DISCOGS_KEY = process.env.DISCOGS_KEY;
const DISCOGS_SECRET = process.env.DISCOGS_SECRET;
const DISCOGS_REDIRECT_URI = process.env.DISCOGS_REDIRECT_URI;

// Récupération de l'URL de connexion à l'App Discogs
router.get("/authorize", function (req, res, next) {
  try {
    const oAuth = new Discogs().oauth();

    oAuth.getRequestToken(DISCOGS_KEY, DISCOGS_SECRET, DISCOGS_REDIRECT_URI, function (err, requestData) {
      req.session.requestData = requestData;
      const authorize_url = requestData.authorizeUrl;
      res.json({ result: true, authorize_url });
    });
  } catch (error) {
    next(error);
  }
});

// Callback une fois que l'app Discogs renvoit vers Music City
router.get("/callback", async (req, res, next) => {
  try {
    console.log("requestData", req.session.requestData);
    const oAuth = new Discogs(req.session.requestData).oauth();

    oAuth.getAccessToken(req.query.oauth_verifier, async function (err, accessData) {
      req.session.accessData = accessData;

      const encoded = Buffer.from(JSON.stringify({ connected: true })).toString("base64");
      res.redirect(`http://127.0.0.1:3001/vinyles-store/connexion?discogs=${encoded}`);
    });
  } catch (error) {
    next(error);
  }
});

// Récupère les informations de base du user
router.get("/identity", async (req, res, next) => {
  try {
    const dis = new Discogs(req.session.accessData);
    dis.getIdentity(function (err, datas) {
      res.json({ result: true, identity: datas });
    });
  } catch (error) {
    next(error);
  }
});

// Récupère la Wantlist
router.get("/users/:username/wantlist", async (req, res, next) => {
  try {
    const dis = new Discogs(req.session.accessData);
    const wantlist = dis.user().wantlist();
    const releases = await wantlist.getReleases(req.params.username);
    res.json({ result: true, wantlist: releases });
  } catch (error) {
    next(error);
  }
});

// Ajoute une release à la wantlist
router.put("/users/:username/wants/:release_id", async (req, res, next) => {
  try {
    const dis = new Discogs(req.session.accessData);
    const wantlist = dis.user().wantlist();
    await wantlist.addRelease(req.params.username, req.params.release_id);
    res.json({ result: true });
  } catch (error) {
    next(error);
  }
});

// Supprime une release de la wantlist
router.delete("/users/:username/wants/:release_id", async (req, res, next) => {
  try {
    const dis = new Discogs(req.session.accessData);
    const wantlist = dis.user().wantlist();
    await wantlist.removeRelease(req.params.username, req.params.release_id);
    res.json({ result: true });
  } catch (error) {
    next(error);
  }
});

// Récupère la collection de vinyles
router.get("/users/:username/collection", async (req, res, next) => {
  try {
    const dis = new Discogs(req.session.accessData);
    const collection = dis.user().collection();
    const releases = await collection.getReleases(req.params.username, 0);
    res.json({ result: true, collection: releases });
  } catch (error) {
    next(error);
  }
});

// Ajoute une release à la collection
router.put("/users/:username/collection/:release_id", async (req, res, next) => {
  try {
    const dis = new Discogs(req.session.accessData);
    const collection = dis.user().collection();
    await collection.addRelease(req.params.username, 0, req.params.release_id);
    res.json({ result: true });
  } catch (error) {
    next(error);
  }
});

// Supprime une release de la collection
router.delete("/users/:username/collection/:release_id", async (req, res, next) => {
  try {
    const dis = new Discogs(req.session.accessData);
    const collection = dis.user().collection();
    const instances = await collection.getReleaseInstances(req.params.username, req.params.release_id);
    await collection.removeRelease(req.params.username, 0, req.params.release_id, instances.releases[0].instance_id);
    res.json({ result: true });
  } catch (error) {
    next(error);
  }
});

// Récupère une release (pas besoin du token user sur ce endpoint)
router.get("/releases/:release_id", async (req, res, next) => {
  try {
    const url = `https://api.discogs.com/releases/${req.params.release_id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Discogs key=${DISCOGS_KEY}, secret=${DISCOGS_SECRET}`,
        "Content-Type": "application/json",
      },
    });
    const release = await response.json();

    if (release.message)
      throw Object.assign(new Error(release.message), {
        status: 404,
      });

    res.json({ result: true, release });
  } catch (error) {
    next(error);
  }
});

// Recherche sur l'API (pas besoin du token user sur ce endpoint)
router.post("/database/search", async (req, res, next) => {
  try {
    const { search, params } = req.body;
    const url_params = new URLSearchParams({ q: search, ...params });
    const url = `https://api.discogs.com/database/search?${url_params}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Discogs key=${DISCOGS_KEY}, secret=${DISCOGS_SECRET}`,
        "Content-Type": "application/json",
      },
    });
    const datas = await response.json();
    res.json({ result: true, results: datas.results });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
