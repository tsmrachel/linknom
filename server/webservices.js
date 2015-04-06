
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







// start node server

app.listen(3000);
console.log('Listening on port 3000');

