var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    opendatacc = require('./opendatacc-endpoint');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var router = express.Router();

router.route('/:dataset')
    .all(function(request, response, next) {
        opendatacc.getDataCaceres(request.params.dataset, function(data) {
            return response.json(data);
        });
    });

app.use(router);

app.listen(3000, function() {
    console.log("Node server running on http://localhost:3000");
});
