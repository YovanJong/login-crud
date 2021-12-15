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

app.post('/table/insert', function (request, response) {
    var month = request.body.month;
    var year = request.body.year;
    var item = request.body.item;
    var jumlah = request.body.jumlah;

    connection.query("INSERT INTO transfers (month,year,item,jumlah) VALUES(?,?,?,?)", [month, year, item, jumlah], function (error, results, fields) {
        if (error) throw err;
        response.end();
    });
});

app.post('/table/update', function (request, response) {
    var month = request.body.month;
    var year = request.body.year;
    var item = request.body.item;
    var jumlah = request.body.jumlah;
    var id = request.body.id;
    console.log(id);
    connection.query("UPDATE transfers SET month = ? , year = ? , item = ? , jumlah = ? WHERE id = ?", [month, year, item, jumlah, id], function (error, results, fields) {
        if (error) throw err;
        response.end();
    });
});

app.get('/delete/table/:id', function (request, response) {
    var id = request.params.id;
    connection.query("DELETE FROM transfers where id=? ", [id], function (error, results, fields) {
        if (error) throw err;
        response.end();
    });
});

app.get('/table/get-transfer', function (request, response) {
    connection.query('SELECT * FROM transfers', function (error, results, fields) {
        if (error) throw err;
        response.send(results);
    });
});

app.listen(8080, '127.0.0.1')
