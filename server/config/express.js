var express = require('express'),
    stylus = require('stylus'),
logger = require('express-logger'),
    bodyParser = require('body-parser'),
    cookieParser=require('cookie-parser'),
    passport = require('passport'),
    session = require('express-session');

module.exports = function(app, config) {
    function compile(str, path) {
        return stylus(str).set('filename', path);
    }

    app.use(stylus.middleware(
        {
            src:config.rootPath + '/public',
            compile:compile
        }
    ));

    app.use(express.static(config.rootPath + '/public'));
    app.use(logger({path: "logfile.txt"}));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(session(
        {secret:'multivision unicrons',
        resave: true,
        saveUninitialized: true,
        //cookie: { secure: true }
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.set("views",config.rootPath+"/server/views");
    app.set("view engine","jade");
};