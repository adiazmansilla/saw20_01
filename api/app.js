const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
//const axios = require('axios');
const app = express()
const root = path.resolve(__dirname, '..')
const db = require('./queries')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

 /**
   * Indicates that columns have changed in a table.
   *
   * @param {string} type
   *   Type of change: 'show' or 'hide'.
   *
   * @event columnschange
   */
app.use(function (req, res, next) { console.log(req.url); next(); });

// Directly serve static content from /client
 /**
   * Indicates that columns have changed in a table.
   *
   * @param {string} type
   *   Type of change: 'show' or 'hide'.
   *
   * @event columnschange
   */
app.use(express.static(root + '/client'));

// 
app.get('/api/entities/:entityCode', async (req, res) => {
    try {
        var Request = require("request");
        Request.get(`http://www.wikidata.org/entity/${req.params.entityCode}`, (error, response, body) => {
            if (error) {
                //PENDIENTE MANEJO DE ERRORES CODIFICADOS
                return console.dir(error);
            }
            return res.status(200).json(JSON.parse(body));
        });
    } catch (err) {
        console.log('error desconocido', err);
        const error = {
            msg: 'Error al listar'
        }
        console.log('error desconocido', err);
        return res.status(500).json(error.msg);
    }
});

app.get('/api/entities/:entityCode/annotations', db.getAnnotationsByEntityCode)

app.post('/api/entities/annotations', db.createAnnotation)

app.put('/api/entities/annotations', db.updateAnnotation)

app.delete('/api/entities/:entityCode/annotations/:annotationProperty', db.deleteAnnotation)

// PROFESOR: Simple REST API that returns some entities
/*app.get('/api/entities', (req,res) => 
 res.send({ entities: 
   ['Q2887', 
    'Q33986789',
       'sdfgsdgfsdgf'
   ]})
);*/



module.exports = app
