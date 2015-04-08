function isNullorUndefined(p1){

    if (p1 === null || p1 === undefined){

        return true;
    }

    else {

        return false;
    }
};


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






// app related modules

var randomstring = require('randomstring');

var useragent = require('express-useragent');
app.use(useragent.express());

var IpInfo = require("ipinfo");





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

    var result = db("urls").one(function(r) {
        return r.shorturl === shorturl;
    }).result;

    

    if (result === null){

        res.send("<html><p> sorry, we didn't find a matching url for that shortlink </p></html>");
    }

    else{

        var url = result.url;

        console.log("shorturl : " + shorturl);
        console.log("url : " + url);

        var user_data = {shorturl: shorturl};


    // user agent information

    user_data.isMobile = isNullorUndefined(req.useragent.isMobile) ? 'unknown' : req.useragent.isMobile;

    user_data.isTablet = isNullorUndefined(req.useragent.isTablet) ? 'unknown' : req.useragent.isTablet;

    user_data.isDesktop = isNullorUndefined(req.useragent.isDesktop) ? 'unknown' : req.useragent.isDesktop;

    user_data.Browser = isNullorUndefined(req.useragent.Browser) ? 'unknown' : req.useragent.Browser;

    user_data.Version = isNullorUndefined(req.useragent.Version) ? 'unknown' : req.useragent.Version;

    user_data.OS = isNullorUndefined(req.useragent.OS) ? 'unknown' : req.useragent.OS;

    user_data.Platform = isNullorUndefined(req.useragent.Platform) ? 'unknown' : req.useragent.Platform;



    // Current ip information
    IpInfo(function (err, cLoc) {


        user_data.ip = isNullorUndefined(cLoc.ip) ? 'unknown' : cLoc.ip;

        user_data.hostname = isNullorUndefined(cLoc.hostname) ? 'unknown' : cLoc.hostname;

        user_data.city = isNullorUndefined(cLoc.city) ? 'unknown' : cLoc.city;

        user_data.country = isNullorUndefined(cLoc.country) ? 'unknown' : cLoc.country;

        user_data.loc = isNullorUndefined(cLoc.loc) ? 'unknown' : cLoc.loc;

        user_data.org = isNullorUndefined(cLoc.org) ? 'unknown' : cLoc.org;

        console.log(user_data);

        db("users").insert(user_data);
    });

    

    console.log(db("users").all().result);

}



res.redirect(url); 


});



//quickfix for ipinfo being called on favicon.ico load
app.get('/favicon.ico', function(req, res) {
    res.sendStatus(404);
});





// start node server

app.listen(3000);
console.log('Listening on port 3000');

