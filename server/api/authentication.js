var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var auth = require('../services/security');
var Cookie = require('cookies');
var router = express.Router();
const cookieKey = "jwt";
const jwtSecret = "HelloWorld";


router.post('/auth/login', auth.authentication, function (req, res) {
    var cookies = new Cookie(req, res);
    var user = {
        "username": req.user[0].username
    };
    var token = jwt.sign(user, jwtSecret);
    cookies.set(cookieKey, token);
    res.json({
        success: true,
    });
});

router.post('/auth/logout', function (req, res) {
    var cookies = new Cookie(req, res);
    cookies.set(cookieKey, "");
    res.json({
        msg: 'Session ended'
    })

});

router.get('/auth/verifyAuthentication', function (req, res) {
    var cookies = new Cookie(req, res);
    var token = cookies.get(cookieKey);
    if (token) {
        res.status(200).json({
            isVerified: true,
	        msg: 'Auth verified.'
        });
    } else {
        res.status(404).json({
	        isVerified: false,
	        msg: 'Auth required!'
        });
    }
});

module.exports = router;
