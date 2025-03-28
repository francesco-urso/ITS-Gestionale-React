const products = require('../models/products');

exports.getAllProducts = async (req, res) => {
    try {
        const allProducts = await products.findAll();
        res.status(200).json(allProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore ricerca prodotti' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const newProduct = await products.create(req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nella creazione di un nuovo prodotto' });
    }
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await products.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Prodotto non trovato' });
        }
        await product.update(req.body);
        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nell\'aggiornamento di un prodotto' });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await products.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Prodotto non trovato' });
        }
        await product.destroy();
        res.status(200).json({ message: 'Prodotto cancellato con successo' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore cancellazione prodotto' });
    }
};