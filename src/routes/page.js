/*
const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');

Router.use((req, res, next) => {
res.locals.user = req.user;
next();
});

Router.get('/profile', isLoggedIn, renderProfile);
*/