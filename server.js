var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/movies');

var movieSchema = mongoose.Schema({
    title: String,
    actor: String
});

var Movie = mongoose.model('Movie', movieSchema);

app.use(express.static('./static'));


var movieRouter = express.Router();

movieRouter.route('/')
    .get(function(req, res) {
        Movie.find(function(err, movies) {
            if(err) res.send(err);
            res.json(movies);
        })
    })

    .post(function(req, res) {
        var movie = new Movie({
            title: req.body.title,
            actor: req.body.actor
        });
        movie.save(function(err, movie) {
            if(err) res.send(err);
            res.json(movie);
        });
    });


movieRouter.route('/:id')
    .get(function(req, res) {
        Movie.findById(req.params.id, function(err, movie) {
            if(err) res.send(err);
            res.json(movie);
        })
    })
    .put(function(req, res) {
        Movie.findById(req.params.id, function(err, movie) {
            movie.actor = req.body.title;
            movie.actor = req.body.actor;
            movie.save(function(err, movie) {
                if(err) res.send(err);
                res.json(movie);
            })
        })
    })
    .delete(function(req, res) {
        Movie.findByIdAndRemove(req.params.id, function(err, movie) {
            res.json(movie);
        })
    });



app.use('/api', movieRouter);



app.listen(3000, function() {
    console.log('The server is listening on port 3000.');
});