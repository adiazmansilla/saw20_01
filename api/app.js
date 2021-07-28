const express = require('express');
const path = require('path');
const app = express()
const root = path.resolve(__dirname, '..')
const db = require('./queries')
const wikidata = require('./wikidata')

app.use(function (req, res, next) { console.log(req.url); next(); });
app.use(express.static(root + '/client'));


/* WIKIDATA RESOURCES */
/************************/
app.get('/api/entities/:entityCode', wikidata.getWikidataEntity);
app.get('/api/entities', wikidata.getSparqlQuery);
app.get('/api/entities-all-types/:entityCode', wikidata.getWikidataEntityAllTypes);
/************************/

/* POSTGRESQL RESOURCES */
/************************/
app.get('/api/entities/:entityCode/annotations', db.getAnnotationsByEntityCode)
app.post('/api/entities/annotations', db.createAnnotation)
app.put('/api/entities/annotations', db.updateAnnotation)
app.delete('/api/entities/:entityCode/annotations/:annotationProperty', db.deleteAnnotation)
/************************/

module.exports = app
