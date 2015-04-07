
// app related modules

var randomstring = require('randomstring');







// express related modules

var express = require('express');
var app = express();

var request = require('request');

var bodyParser = require('body-parser');

var multer = require('multer'); //to access parameters in multipart form
app.use(multer());
//global.config = require('./config');
//global.constants = require('./constants');

var cors = require('cors');
app.use(cors());

//app.use(bodyParser()); deprecated - provide extended value
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));







// nosql memoria related modules

var Memoria = require('Memoria');

var db = Memoria("linknom", function(exists) {

    if(!exists) {

        /* some creational functions */    
        db("urls");
        db("users");
    }       

});







// routing methods

app.get('/api/shorten',function(req,res){

    console.log("in shorten function");

    var url = req.query.url; 

    console.log("url : " + url);

    var host = "localhost:3000/"

    var shorturl = randomstring.generate(7);

    console.log("shorturl : " + shorturl);

    try{

    db("urls").insert({ url: url, shorturl: shorturl });

    res.send({shorturl: shorturl});

    }

    catch(err){

        res.send({error : "sorry, something went wrong while processing your request, please try again!"});
    }
    
});

app.get('/:id',function(req,res){

    console.log("in redirect function");


    var shorturl = req.params.id;


    url = db("urls").one(function(r) {
        return r.shorturl === shorturl;
    }).result.url; 

    console.log("shorturl : " + shorturl);
    console.log("url : " + url);

    res.redirect(url);
    
});








// start node server

app.listen(3000);
console.log('Listening on port 3000');

