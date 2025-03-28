const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const token_blacklist = sequelize.define('token_blacklist', {
    token_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    revoked_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: true,
    }
}, {
    tableName: 'token_blacklist',
});

module.exports = token_blacklist;
