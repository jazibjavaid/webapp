const { DataTypes } = require('sequelize');
const db = require('../connection.js');

const Account = db.define('Account', {
   id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    account_created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    account_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
}, {
  timestamps: false
});

module.exports = Account;
  