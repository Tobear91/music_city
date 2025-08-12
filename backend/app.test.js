const request = require('supertest');
const app = require('./app');
const express = require("express");

// Retour de response de la route Discogs
const response = {
  result: true,
  identity: {
    id: 1,
    username: "example",
    resource_url: "https://api.discogs.com/users/example",
    consumer_name: "Your Application Name",
  },
};


app.get("/identity", (req, res) => {
  res.json(response);
});

it("Réponse de l'API Discogs et de la route /identity", async () => {
  const res = await request(app).get("/identity");

  expect(res.status).toBe(200);
  expect(res.body.result).toBe(true);
  expect(res.body).toEqual(response);
  expect(res.body.identity.resource_url).toContain("api.discogs.com");
});



// on test la route qui nous retourne les blindtest
it ('GET blindtest/randomshow', async()=>{
    const res = await request(app).get('/blindtest/randomshow');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('series');
    expect(Array.isArray(res.body.series)).toBe(true);
    expect(res.body.series.length).toBe(10);
    // permet de vérifier que chaque élement est un objet non vide
    res.body.series.forEach(serie => {
        expect(typeof serie).toBe('object');
        expect(Object.keys(serie).length).toBeGreaterThan(0);
    });
})
