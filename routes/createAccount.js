const express = require('express'),
      db = require('../models'),
      bcrypt = require('bcrypt');

createAccountRouter = express.Router();
module.exports = createAccountRouter;

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}

createAccountRouter.post('/', asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await db.users.findOne({ where: { username } });
 
    if(existingUser) {
        return res.status(409).render('createAccount', { message: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt) 
    const newUser = await db.users.create({ username: username, password: hashedPassword });

    if(newUser) {
        return res.status(201).redirect(`/users/${newUser.id}`);
    } else {
        return res.status(500).render('createAccount', { message: 'Error creating account' });
    }
}));

createAccountRouter.get('/', function(req, res, next) {
    res.render('createAccount', { message: null });
});
