## Nodejs Opendata Cáceres proxy

A nodejs server that acts like a proxy to the Opendata Cáceres portal.

Currently, you can query the following datasets: [cinemas](opendata.caceres.es/dataset/cines-caceres), [monuments](http://opendata.caceres.es/dataset/monumentos-caceres), [museums](http://opendata.caceres.es/dataset/museos-caceres), [parking spaces for disabled](http://opendata.caceres.es/dataset/plazas-de-movilidad-reducida-caceres), [restaurants](http://opendata.caceres.es/dataset/restaurantes-caceres) and [theaters](http://opendata.caceres.es/dataset/teatros-caceres). 

The queries used are in the opendatacc-endpoint.js file, you can modify these based on the information you want to obtain from the datasets. The results are cached, so after the first query to one particular dataset, the subsequent queries should return the information instantly.

## Demo

![](https://dl.dropboxusercontent.com/s/cufh1r1n17zsx81/node-api-opendata_demo.gif)


## Run the server locally

Clone this repository or download and extract the project to where you want to work.

### Install dependencies:

1)  Check your Node.js version.

```sh
node --version
```

2)  If you don't have Node.js installed go to [nodejs.org](https://nodejs.org) and click on the big green Install button.

3)  Install `npm` dependencies.

```sh
cd node-opendatacc-proxy && npm install
```

### Test the server

```sh
node app.js
```

In a web browser, type in the address bar localhost:3000/{dataset_name}. For example, if you want the information of the theaters in the city of Cáceres go to: localhost:3000/theater. This is the response:

```json
[
   {
      "nombre":{
         "type":"literal",
         "xml:lang":"es",
         "value":"Gran Teatro"
      },
      "lat":{
         "type":"typed-literal",
         "datatype":"http://www.w3.org/2001/XMLSchema#decimal",
         "value":"39.473166"
      },
      "long":{
         "type":"typed-literal",
         "datatype":"http://www.w3.org/2001/XMLSchema#decimal",
         "value":"-6.375632"
      },
      "tieneEnlaceSIG":{
         "type":"uri",
         "value":"http://sig2.caceres.es/SerWeb/fichatoponimo.asp?mslink=2398"
      },
      "image":"http://sig2.caceres.es/fotosOriginales/toponimia/GRAN_TEATRO_01.jpg"
   }
]
```
