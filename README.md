## Nodejs Opendata Cáceres proxy

A nodejs server that acts like a proxy to the Opendata Cáceres portal.

Currently, you can query the following datasets: [cinemas](opendata.caceres.es/dataset/cines-caceres), [monuments](http://opendata.caceres.es/dataset/monumentos-caceres), [museums](http://opendata.caceres.es/dataset/museos-caceres), [parking spaces for disabled](http://opendata.caceres.es/dataset/plazas-de-movilidad-reducida-caceres), [restaurants](http://opendata.caceres.es/dataset/restaurantes-caceres) and [theaters](http://opendata.caceres.es/dataset/teatros-caceres). 

The queries used are in the opendatacc-endpoint.js file, you can modify these based on the information you want to obtain from the datasets. The results are cached, so after the first query to one particular dataset, the subsequent queries should return the information instantly.

## Demo

![](https://lh3.googleusercontent.com/T7IAUdQGIh3UkETz9Ng4A3stH6H308kw-lBGxXl43k12jSm4RJi3WYAKWRU2rNYMOqf9Ov42l-MRH8_7-8TcTUYrKdmwMkqGbDMYoxMhyqchq8MZoIj-ndc2kOmeZ7DbJJHflumxOwxbC8JFor4B3tfMYx2rFRTIcgZ8UbYvocceQn8nA_cIQ_SkpIDvugUOiXUA4SxGhnXuJD0XZBH2-81jC7W5CJ5CG0Rt1sLktqRAp-3mg_vttBEe059O9Pjcgqw9zmGPZYGRo2BZWcVT9lLSF05sIdbudb-0O-jmKJZCZdanndeTKII5XmyL6B1az1v2ULwue5vfwcH64TpdkhSYykr9duix9vN13-cHfscmtvSxMEW6z8aOb-rVTcDieoynCZuLCFsKP3e1L7Z_qEkTXem9yz6RmAPN36aFPAxIZFg4w2xKyuHqtG_785jpIrZX3p3L60IJr-UUk5ovvlpB6xqavnhxcAMeAcPh1oTNtgh3d5v4_2-9hCoFUL3LGPGv7-S2NFb-Jcn_gR50maiNTT-BQI1OnD8IOVazSjV4w-fJEeMHvuHXpDzTysSJ1LBULgyWkiVOlsd0q_c3RqZFKYZV9jE=w297-h480-no)


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
