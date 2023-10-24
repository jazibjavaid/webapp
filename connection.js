const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;
if (process.env.PGHOST !== 'localhost') {
    sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
        host: process.env.PGHOST,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        }
    });
} else {
  sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
      host: process.env.PGHOST,
      dialect: 'postgres'
  });
}

module.exports = sequelize;