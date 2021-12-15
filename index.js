var express = require('express');
var router = express.Router();
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Login' });
});
router.get('/table', function (req, res, next) {
    res.render('table', { title: 'Table' });
});


module.exports = router;