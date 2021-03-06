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

//Connection avec MongoDB
    MongoClient.connect('mongodb://127.0.0.1:27017/carnet_adresse', (err, database) => {
	   if (err) return console.log(err)
	   db = database
	   app.listen(8081, () =>{
	   console.log('connexion à la BD et on écoute sur le port 8081')
     })
    })


// Affichage de la db Adresse avec MongoDB
    app.get('/',  (req, res)  => {
    console.log('la route route get / = ' + req.url)
 
    var cursor = db.collection('adresses').find().toArray(function(err, resultat){
       if (err) return console.log(err)
    // renders index.ejs
    // affiche le contenu de la BD adresses
    res.render('index.ejs', {adresses:resultat})
      })  
    })

// Ajout d'un élément dans la db MongoDB
    app.post('/ajouter',  (req, res) => {
    console.log(req.body._id);

    var ajoutAdresse={};
    if(req.body._id !=""){
      ajoutAdresse['_id']=ObjectID(req.body._id);
    }

    ajoutAdresse["nom"] = req.body.nom;
    ajoutAdresse["prenom"] = req.body.prenom;
    ajoutAdresse["telephone"] = req.body.telephone;

        db.collection('adresses').save(ajoutAdresse, (err, result) => {
        if (err) return console.log(err)
        console.log('sauvegarder dans la BD')
        res.redirect('/')
      })
    })

// Destruction d'un élément dans la db MongoDB
    app.get('/detruire/:id', (req, res) => {
      var id = req.params.id
      console.log(id)
      db.collection('adresses').findOneAndDelete({"_id": ObjectID(req.params.id)}, (err, resultat) => {

      if (err) return console.log(err)
      res.redirect('/')  // redirige vers la route qui affiche la collection
      })
    });



