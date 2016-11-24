// Teatros
var teatrosQuery = 'select ?nombre ?lat ?long ?tieneEnlaceSIG where {?uri a om:Teatro. ?uri rdfs:label ?nombre.?uri geo:lat ?lat.?uri geo:long ?long OPTIONAL{?uri om:tieneEnlaceSIG ?tieneEnlaceSIG.}'
// Cines
var cinesQuery = 'select ?nombre ?lat ?long ?tieneEnlaceSIG where{?uri a om:Cine. ?uri rdfs:label ?nombre.?uri geo:lat ?lat.?uri geo:long ?long OPTIONAL{?uri om:tieneEnlaceSIG ?tieneEnlaceSIG.}'
// Monumentos
var monumentosQuery = 'select ?nombre ?lat ?long ?tieneEnlaceSIG ?enlacedbpedia where { ?uri a om:Monumento. ?uri rdfs:label ?nombre.?uri geo:lat ?lat.?uri geo:long ?long OPTIONAL{?uri om:tieneEnlaceSIG ?tieneEnlaceSIG} OPTIONAL{?uri owl:sameAs ?enlacedbpedia.}'
// Museos
var museosQuery = 'select ?nombre ?lat ?long ?tieneEnlaceSIG ?descripcion ?enlacedbpedia where {?uri a om:Museo. ?uri rdfs:label ?nombre.?uri geo:lat ?lat.?uri geo:long ?long OPTIONAL{?uri om:tieneEnlaceSIG ?tieneEnlaceSIG} OPTIONAL{?uri owl:sameAs ?enlacedbpedia} OPTIONAL{?uri schema:description ?descripcion.}'
// PlazaMovilidadReducida
var movilidadQuery = 'select ?uri ?lat ?long ?tieneEnlaceSIG ?descripcion where {?uri a om:PlazaMovilidadReducida. ?uri rdfs:label ?nombre.?uri geo:lat ?lat.?uri geo:long ?long OPTIONAL{?uri om:tieneEnlaceSIG ?tieneEnlaceSIG} OPTIONAL{?uri rdfs:comment ?descripcion.}'
// Bares restaurantes y cafes
var cafeRestauranteBarQuery = 'select ?nombre ?lat ?long where {{?uri a om:BarCopas. ?uri rdfs:label ?nombre.?uri geo:lat ?lat.?uri geo:long ?long.} union {?uri a om:CafeBar. ?uri rdfs:label ?nombre.?uri geo:lat ?lat.?uri geo:long ?long.} union{?uri a om:Restaurante. ?uri rdfs:label ?nombre.?uri geo:lat ?lat.?uri geo:long ?long.}'


var monumentosNewQuery = 'select ?nombre ?lat ?long ?tieneEnlaceSIG where{?uri a om:Monumento. ?uri rdfs:label ?nombre.?uri geo:lat ?lat.?uri geo:long ?long.?uri om:tieneEnlaceSIG ?tieneEnlaceSIG.}'

var museosNewQuery = 'select ?nombre ?lat ?long ?tieneEnlaceSIG where{?uri a om:Museo. ?uri rdfs:label ?nombre.?uri geo:lat ?lat.?uri geo:long ?long.?uri om:tieneEnlaceSIG ?tieneEnlaceSIG.}'

var viasQuery = 'select ?nombre ?lat ?long ?tieneEnlaceSIG where{?uri a om:Via. ?uri om:nombreVia ?nombre.?uri om:puntoMedioVia ?uri2.?uri2 geo:lat ?lat.?uri2 geo:long ?long.?uri om:tieneEnlaceSIG ?tieneEnlaceSIG.}'

var casaCulturaQuery = 'select ?nombre ?lat ?long ?tieneEnlaceSIG where{?uri a om:CasaCultura. ?uri rdfs:label ?nombre.?uri geo:lat ?lat.?uri geo:long ?long.?uri om:tieneEnlaceSIG ?tieneEnlaceSIG.}'

var centrosReligiososQuery = 'select ?nombre ?lat ?long ?tieneEnlaceSIG where{?uri a om:CentroReligioso. ?uri rdfs:label ?nombre.?uri geo:lat ?lat.?uri geo:long ?long.?uri om:tieneEnlaceSIG ?tieneEnlaceSIG.}'


/*
 * We have to:
 	1. Get all the information of the selected dataset with a query to the SPARQL endpoint of opendata Cáceres
 	2. For every element of the dataset, get an image from it's 'enlaceSIG'
 		2.1. We add the image as a property of the place (place.image). 
 			If no image was found, this property is undefined.
   Both calls are asynchronous, and first call must finish before second call is performed
 */

var async = require('async'), // Do calls in series
    request = require('request'), // Do http request (async)
    cheerio = require('cheerio'); // Get img tags from external url
NodeCache = require("node-cache"); // Save query results on the cache for one day.

var myCache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

module.exports = {

    /**
     * Get all the elements of one particular dataset of Cáceres
     * @param {string} whichDataset - One of { monument, museum, restaurant, parking, theater, cinema }
     */
    getDataCaceres: function(whichDataset, allDoneCallback) {

        async.waterfall(
            [
                // 1. Get all the information of the selected dataset with a query to the SPARQL endpoint of opendata Cáceres
                function(callback) {
                    var data;
                    try {
                        data = myCache.get(whichDataset, true);
                        // Finish, since image urls are also included in the cache
                        allDoneCallback(data);
                    } catch (err) {
                        // Not in the cache.
                        getDataFromEndpoint(whichDataset, function dataObtainedCallback(bindings) {
                            callback(null, bindings); // get the images
                        });
                    }
                },

                // 2. For every element of the dataset, get an image from it's 'enlaceSIG'
                function(bindings, callback) {
                    addImageToBindings(bindings, callback);
                },
            ],

            // Final callback function
            function(err, results) {
                // If this point is reached, results are not in the cache. Store them
                if (results.length)
                    myCache.set(whichDataset, results);
                allDoneCallback(results);
            }
        );

    },
    
        getDataCaceresById: function(whichDataset, id, allDoneCallback) {
        async.waterfall(
            [
                // 1. Get all the information of the selected dataset with a query to the SPARQL endpoint of opendata Cáceres
                function(callback) {
                        getDataFromEndpointById(whichDataset, id, function dataObtainedCallback(bindings) {
                            callback(null, bindings); // get the images
                        });
                },

                // 2. For every element of the dataset, get an image from it's 'enlaceSIG'
                function(bindings, callback) {
                    addImageToBindings(bindings, callback);
                },
            ],

            // Final callback function
            function(err, results) {
                allDoneCallback(results[0]);
            }
        );

    }
    
};


function getDataFromEndpoint(whichDataset, dataObtainedCallback) {
    var endpoint = 'http://opendata.caceres.es/sparql/';
    var graph = '';
    var SPARQLquery = '';
    switch (whichDataset) {
        case 'monument':
            SPARQLquery = monumentosQuery+'}';
            break;
        case 'museum':
            SPARQLquery = museosQuery+'}';
            break;
        case 'restaurant':
            SPARQLquery = cafeRestauranteBarQuery+'}';
            break;
        case 'parking':
            SPARQLquery = movilidadQuery+'}';
            break;
        case 'theater':
            SPARQLquery = teatrosQuery+'}';
            break;
        case 'cinema':
            SPARQLquery = cinesQuery+'}';
            break;
        case 'monumento':
            SPARQLquery= monumentosNewQuery;
            break;
        case 'via':
            SPARQLquery = viasQuery;
            break;
    case 'casaCultura':
            SPARQLquery = casaCulturaQuery;
            break;
        case 'museo':
            SPARQLquery = museosNewQuery;
            break;
        case 'centroReligioso':
            SPARQLquery = centrosReligiososQuery;
            break;
        default:
            break;
    }
    if (SPARQLquery) {
        request({
                url: 'http://opendata.caceres.es/sparql/',
                qs: { // Query string data
                    'default-graph-uri': graph,
                    query: SPARQLquery,
                    format: 'json'
                },
            },
            function(error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    var jsonBody = JSON.parse(body);
                    dataObtainedCallback(jsonBody.results.bindings);
                }
            });

    } else { // return empty object if bad dataset was selected. 
        dataObtainedCallback([]);
    }
}

function getDataFromEndpointById(whichDataset, id, dataObtainedCallback) {
    var endpoint = 'http://opendata.caceres.es/sparql/';
    var graph = '';
    var SPARQLquery = '';
    switch (whichDataset) {
        case 'monument':
            SPARQLquery = monumentosQuery + 'filter(regex(?uri,"/'+id+'_"))}';
            break;
        case 'museum':
            SPARQLquery = museosQuery + 'filter(regex(?uri,"/'+id+'-"))}';
            break;
        case 'restaurant':
            SPARQLquery = cafeRestauranteBarQuery + 'filter(regex(?uri,"/'+id+'_"))}';
            break;
        case 'parking':
            SPARQLquery = movilidadQuery + 'filter(regex(?uri,"/'+id+'_"))}';
            break;
        case 'theater':
            SPARQLquery = teatrosQuery + 'filter(regex(?uri,"/'+id+'_"))}';
            break;
        case 'cinema':
            SPARQLquery = cinesQuery + 'filter(regex(?uri,"/'+id+'_"))}';
            break;
        default:
            break;
    }
    if (SPARQLquery) {
        request({
                url: 'http://opendata.caceres.es/sparql/',
                qs: { // Query string data
                    'default-graph-uri': graph,
                    query: SPARQLquery,
                    format: 'json'
                },
            },
            function(error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    var jsonBody = JSON.parse(body);
                    dataObtainedCallback(jsonBody.results.bindings);
                }
            });

    } else { // return empty object if bad dataset was selected. 
        dataObtainedCallback([]);
    }
}


function addImageToBindings(bindings, allImagesObtainedCallback) {

    var calls = [];

    bindings.forEach(function(place) {

        var enlaceSIG = place.tieneEnlaceSIG;

        if (enlaceSIG)
            calls.push(function(callback) {
                fetchImageFromSIGLink(enlaceSIG.value, function(placeImage) {
                    if (placeImage)
                        place.image = placeImage;
                    callback(null, place);
                })
            });
    });

    async.parallel(calls, function(err, result) {
        // This code will run after all calls finished the job or when any of the calls passes an error
        allImagesObtainedCallback(null, bindings);
    });
}

function fetchImageFromSIGLink(sigLink, callback) {

    var pattern = new RegExp('\/fotosOriginales\/toponimia\/');

    request(sigLink, function(err, resp, body) {

        $ = cheerio.load(body);
        images = $('img'); // jquery get all imgs

        var placeImage;
        for (var i = 0; i < images.length; i++) {
            var imageSrc = $(images[i]).attr('src');
            if (pattern.test(imageSrc)) {
                placeImage = 'http://sig2.caceres.es' + imageSrc;
                break;
            }
        }
        callback(placeImage);
    });
}
