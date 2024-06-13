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

usersRouter.get('/:id/cart', async (req, res, next) => {
    try{
        const user = await db.User.findOne({ where: { id: req.params.id } });
        if (!user) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }

        let cart = await db.Cart.findOne({ where: { user_id: user.id } });
        if (!cart) {
            cart = await db.Cart.create({ user_id: user.id });
        }

        const cartItems = await db.CartItem.findAll({ where: { cart_id: cart.id } });
        const productIds = cartItems.map(item => item.product_id);
        const products = await db.Product.findAll({ where: { id: productIds } });

        const cartItemsWithProducts = cartItems.map(item => {
            const product = products.find(prod => prod.id === item.product_id);
            return { cartItem: item, product };
        });
        console.log(cartItemsWithProducts);
        res.render('cart', { user, cartItems: cartItemsWithProducts });

    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal Server Error');
    }
});