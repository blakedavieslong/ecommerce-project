const express = require('express');
const passport = require('passport');

loginRouter = express.Router();
module.exports = loginRouter;

loginRouter.get('/', function(req, res, next) {
    res.render('login', { message: req.flash('error') });
});

loginRouter.post('/', passport.authenticate("local", 
    { successRedirect: (req, res) => {
        return res.redirect(`/users/${req.user.id}`);
      },
      failureRedirect: "/login",
      failureFlash: true
    }
));