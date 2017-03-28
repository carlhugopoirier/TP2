const fs = require("fs");
const express = require('express');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID;
const app = express();
app.set('view engine', 'ejs'); // générateur de template 
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))  // pour utiliser le dossier public
app.use(bodyParser.json())  // pour traiter les données JSON

var db // variable qui contiendra le lien sur la BD

		MongoClient.connect('mongodb://carnet_adresse', function(err, database)  {
		  if (err) return console.log(err)
		  db = database
		  app.listen(8081, function() {
		    console.log('connexion à la BD et on écoute sur le port 8081')
		  })
		})


app.get('/', function (req, res) {
 	fs.readFile('public/text/collection_provinces.json', 'utf-8', function (err, data) {
		if (err) return console.error(err);
			obj = JSON.parse(data)
			console.log(obj);
		  	res.render('index.ejs', {provinces: obj});
		});
})

app.get('/afficher',  function(req, res)  {
   console.log('la route route get / = ' + req.url)
 
    var cursor = db.collection('adresse').find().toArray(function(err, resultat){
       if (err) return console.log(err)
    // renders index.ejs
    // affiche le contenu de la BD
    res.render('index.ejs', {adresse:resultat})

    }) 
    

})



