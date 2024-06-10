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

/*productsRouter.get('/:id', function(req, res, next) {
    res.send('Welcome to your page user #' + req.params.id);
});*/