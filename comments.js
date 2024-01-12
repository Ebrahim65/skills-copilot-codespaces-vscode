//Create Web Server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Create Server
var server = app.listen(8081, function(){
    var host = server.address().address
    var port = server.address().port
    console.log('Listening at http://%s:%s', host, port)
});

//Connect to MongoDB
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

//Create Database
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    //Create Collection
    dbo.createCollection("comments", function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });
    //Insert Document
    dbo.collection("comments").insertOne({name: "John", comment: "Hello"}, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
    });
});

//Create GET request
app.get('/comments', function(req, res) {
    res.sendFile(path.join(__dirname + '/comments.html'));
});

//Create POST request
app.post('/comments', function(req, res) {
    var name = req.body.name;
    var comment = req.body.comment;
    var newComment = {name: name, comment: comment};
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("comments").insertOne(newComment, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
    res.redirect('/comments');
});

//Create DELETE request
app.delete('/comments', function(req, res) {
    var name = req.body.name;
    var comment = req.body.comment;
    var deleteComment = {name: name, comment: comment};
    MongoClient.connect(url, function(err, db) {
        if (err) throw err; // Fix: Add expression after throw statement
        var dbo = db.db("mydb");
        dbo.collection("comments").deleteOne(deleteComment, function(err) { // Fix: Remove unused 'obj' parameter
            if (err) throw err; // Fix: Add expression after throw statement
        });
    });
});
