var host = "localhost:3000/";

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

var Memoria = require('memoria');

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

    var shorturl = randomstring.generate(7);

    console.log("shorturl : " + shorturl);

    try{

        db("urls").insert({ url: url, shorturl: shorturl });

        res.send({shorturl: host + shorturl});

    }

    catch(err){

        res.status(500).send("Sorry, something went wrong while processing your request, please try again!");
    }
    
});




app.get('/api/stats',function(req,res){

    console.log("in stats function");

    var url = req.query.url; 

    console.log("url : " + url);

    var key = url.replace(host,'');

    console.log ('shorturl : ' + key);

    var result = db("urls").one(function(r) {
        return r.shorturl === key;
    }).result;

    

    if (result === null){

        res.status(404).send("Sorry, we didn't find a matching url for that shortlink");
    }

    else{

        try{

            var linkVisitors = db("users").all(function(r, i) {

              return r.shorturl===key;

          }).result; 

        }

        catch(err){

            res.status(500).send("Sorry, something went wrong while processing your request, please try again!");


        }


        console.log('Visitors : ' + linkVisitors);

        if (linkVisitors === null){

            res.status(404).send("Sorry, nobody accessed your link yet =(");
        }

        else{

            var visitorCount = linkVisitors.length;

            var mobileCount = linkVisitors.filter(function(o) { return o.isMobile; }).length;

            var desktopCount = linkVisitors.filter(function(o) { return o.isDesktop; }).length;

            var tabletCount = linkVisitors.filter(function(o) { return o.isTablet; }).length;


            var browserStats = {};

            linkVisitors.forEach(function(o) { 

                console.log(o.browser);

                if (browserStats[o.browser]) {

                    browserStats[o.browser]++;

                } else {

                    browserStats[o.browser] = 1;
                }
            });

            var countryStats = {};

            linkVisitors.forEach(function(o) { 

                console.log(o.country);

                if (countryStats[o.country]) {

                    countryStats[o.country]++;

                } else {

                    countryStats[o.country] = 1;
                }
            });

            console.log(countryStats);


            var stats = [{visitors : visitorCount}, {mobiles : mobileCount, tablets : tabletCount, desktops : desktopCount }, browserStats, countryStats];

            console.log(stats);

            res.send(stats);

        }
    }



    
});

app.get('/:id',function(req,res){

    console.log("in redirect function");

    var shorturl = req.params.id;

    var result = db("urls").one(function(r) {
        return r.shorturl === shorturl;
    }).result;

    

    if (result === null){

        res.status(404).send("Sorry, we didn't find a matching url for that shortlink");
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

    user_data.browser = isNullorUndefined(req.useragent.browser) ? 'unknown' : req.useragent.Browser;

    user_data.version = isNullorUndefined(req.useragent.version) ? 'unknown' : req.useragent.Version;

    user_data.os = isNullorUndefined(req.useragent.os) ? 'unknown' : req.useragent.OS;

    user_data.platform = isNullorUndefined(req.useragent.platform) ? 'unknown' : req.useragent.Platform;



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

