const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const products = sequelize.define('products', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    prodotto: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descrizione: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    pezzi_magazzino: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    prezzo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    }
}, {
    tableName: 'prodotti',
    timestamps: false
});

module.exports = products;