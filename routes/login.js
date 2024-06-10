const express = require('express');
const passport = require('passport');

loginRouter = express.Router();
module.exports = loginRouter;

loginRouter.get('/', function(req, res, next) {
    res.render('login', { message: req.flash('error') });
});

loginRouter.post('/', (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if(err) {
            return next(err);
        }
        if(!user) {
            req.flash('error', info.message);
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect(`/users/${user.id}`);
        });
    })(req, res, next);
});