var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var path = require('path');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login'
});
var engines = require('consolidate');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/views'));

app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.get('/table', function (req, res) {
    res.render((path.join(__dirname + '/views/table.html')));
})

app.post('/auth', function (request, response) {
    var email = request.body.email;
    var password = request.body.password;
    if (email && password) {
        connection.query('SELECT * FROM users WHERE email = ? AND password = md5(?)', [email, password], function (error, results, fields) {
            if (results.length > 0) {
                // request.session.loggedin = true;
                // request.session.email = email;
                response.redirect('/table');
            } else {
                response.send('Incorrect Username and/or Password!');
                response.redirect('/');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

app.listen(8080, '127.0.0.1')
