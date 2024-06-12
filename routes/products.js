const express = require('express'),
      db = require('../models');

productsRouter = express.Router();
module.exports = productsRouter;

productsRouter.get('/', async (req, res) => {
    try {
        const products = await db.Product.findAll({
            include: [
                {
                    model: db.Image,
                    as: 'images'
                }
            ]
        });
        res.render('products', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
});

productsRouter.get('/:id', async (req, res, next) => {
    try {
        const product = await db.Product.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: db.Image,
                    as: 'images'
                }
            ]
        });
        if (!product) {
            return res.status(404).send(`Product with id of ${req.params.id} not found`);
        }
        res.render('product', { product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Internal Server Error');
    }
});