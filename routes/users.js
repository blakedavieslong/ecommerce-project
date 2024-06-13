const express = require('express'),
      db = require('../models');

usersRouter = express.Router();
module.exports = usersRouter;

usersRouter.get('/:id', async (req, res, next) => {
    try{
        const user = await db.User.findOne({
            where: {
                id: req.params.id
            }
        });
        res.render('user', { user });

    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal Server Error');
    }
});