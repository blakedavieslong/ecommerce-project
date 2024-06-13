const express = require('express'),
      db = require('../models'),
      isAuthenticated = require('../utils/isAuthenticated');

cartRouter = express.Router();
module.exports = cartRouter;

function calculateTotal(cartItems) {
    let totalPrice = 0;
    cartItems.forEach(item => {
        totalPrice += item.product.price * item.cartItem.quantity;
    });
    return totalPrice;
}

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

cartRouter.post('/updateQuantity', isAuthenticated, async (req, res, next) => {
    try{
        const { product_id, quantity } = req.body;
        const user_id = req.user.id;

        let cart = await db.Cart.findOne({ where: { user_id } });
        if (!cart) {
            cart = await db.Cart.create({ user_id });
        }

        const cartItem = await db.CartItem.findOne({ where: { cart_id: cart.id, product_id } });

        if (!cartItem) {
            res.status(404).send('Cart item not found');
            return;
        }

        cartItem.quantity = parseInt(quantity, 10);
        await cartItem.save();

        res.redirect('/cart');

    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).send('Internal Server Error');
    }
});

cartRouter.post('/delete/:id', isAuthenticated, async (req, res, next) => {
    const cartItemId = req.params.id;
    
    try {
        const cartItem = await db.CartItem.findByPk(cartItemId);

        if (!cartItem) {
            res.status(404).send('Cart item not found');
            return;
        }

        await cartItem.destroy();

        res.redirect('/cart');

    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).send('Internal Server Error');
    }
});