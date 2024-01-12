//Create web server
var express = require('express');
var app = express();
var path = require('path');

//Connect to database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MyBlog');

//Create schema for comments
var Schema = mongoose.Schema;
var commentSchema = new Schema({
    name: String,
    comment: String
});
var Comment = mongoose.model('Comment', commentSchema);

//Create route for comments
app.get('/comments', function(req, res){
    res.sendFile(path.join(__dirname, 'comments.html'));
});

//Create route for comments
app.get('/comments', function(req, res){
    res.sendFile(path.join(__dirname, 'comments.html'));
});

//Create route for getting comments
app.get('/api/comments', function(req, res){
    Comment.find(function(err, comments){
        if(err) {
            res.send(err);
        }
        res.json(comments);
    });
});

//Create route for posting comments
app.post('/api/comments', function(req, res){
    Comment.create({
        name: req.body.name,
        comment: req.body.comment,
        done: false
    }, function(err, comment){
        if(err) {
            res.send(err);
        }
        Comment.find(function(err, comments){
            if(err){
                res.send(err);
            }
            res.json(comments);
        });
    });
});

//Create route for deleting comments
app.delete('/api/comments/:comment_id', function(req, res){
    Comment.remove({
        _id: req.params.comment_id
    }, function(err, comment){
        if(err){
            res.send(err);
        }
        Comment.find(function(err, comments){
            if(err){
                res.send(err);
            }
            res.json(comments);
        });
    });
});

//Create route for editing comments
app.get('/api/comments/:comment_id', function(req, res){
    Comment.findOne({
        _id: req.params.comment_id
    }, function(err, comment){
        if(err){
            res.send(err);
        }
        res.json(comment);
    });
});

//Create route for updating comments
app.put('/api/comments/:comment_id', function(req, res){
    Comment.findOne({
        _id: req.params.comment_id
    }, function(err, comment){
        if(err){
            res.send(err);
        }
        comment.name = req.body.name;
        comment.comment = req.body.comment;
        comment.save(function(err, comment){
            if(err){
                res.send(err);
            }
            res.json(comment);
        });
    }); // Add closing parenthesis here
});
