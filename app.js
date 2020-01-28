var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var ejs = require('ejs');
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


app.get('/', function(req, res){
    res.render('index');
});

// Start the server, listening on port on env
server.listen(PORT, () => {
    console.log(`Listening to requests on ${server.address().port}`);
});
