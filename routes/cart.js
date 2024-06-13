const express = require('express'),
      db = require('../models');

cartRouter = express.Router();
module.exports = cartRouter;

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function calculateTotal(cartItems) {
    let totalPrice = 0;
    cartItems.forEach(item => {
        totalPrice += item.product.price * item.cartItem.quantity;
    });
    return totalPrice;
}

cartRouter.post('/', isAuthenticated, async (req, res, next) => {
    try{
        const { product_id, quantity } = req.body;
        const user_id = req.user.id;

        let cart = await db.Cart.findOne({ where: { user_id } });
        if (!cart) {
            cart = await db.Cart.create({ user_id });
        }

        const [cartItem, created] = await db.CartItem.findOrCreate({
            where: { cart_id: cart.id, product_id },
            defaults: { quantity }
        });

        if (!created) {
            cartItem.quantity += parseInt(quantity, 10);
            await cartItem.save();
        }

        res.redirect(`/cart`);

    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).send('Internal Server Error');
    }
});

cartRouter.get('/', isAuthenticated, async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const cart = await db.Cart.findOne({ 
            where: { user_id },
            include: {
                model: db.CartItem,
                as: 'cartItems',
                include: {
                    model: db.Product,
                    as: 'product',
                    include: [{
                        model: db.Image,
                        as: 'images'
                    }]
                }
            }
        });

        const cartItems = cart ? cart.cartItems.map(item => ({
            cartItem: item,
            product: item.product
        })) : [];

        res.render('cart', { cartItems, calculateTotal });

    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send('Internal Server Error');
    }
});