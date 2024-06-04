const express = require('express');

usersRouter = express.Router();
module.exports = usersRouter;

usersRouter.get('/:id', function(req, res, next) {
    res.send('Welcome to your page user #' + req.params.id);
});