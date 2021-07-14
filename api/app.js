const express = require('express');
const path = require('path');
//const axios = require('axios');


const app = express()
const root = path.resolve(__dirname, '..')

// Log invocations
app.use(function (req, res, next) { console.log(req.url); next(); });

// Directly serve static content from /client
app.use(express.static(root + '/client'));

// PROFESOR: Simple REST API that returns some entities
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

        const error = {
            msg: JSON.stringify(err);
        }
        console.log('error desconocido', err);
        console.log(JSON.stringify(error.msg));
        return res.status(500).json(error.msg);
    }
});

// PROFESOR: Simple REST API that returns some entities
/*app.get('/api/entities', (req,res) => 
 res.send({ entities: 
   ['Q2887', 
    'Q33986789'
   ]})
);*/


module.exports = app
