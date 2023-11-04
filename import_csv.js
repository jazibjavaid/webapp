const fs = require('fs');
const csv = require('csv-parser');
const { sequelize } = require('./models/Account.js');
const bcrypt = require('bcrypt');
const { logger } = require('./logger.js');

async function importCSV(filePath) {
  try {
    await sequelize.sync();

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row) => {
        const existingUser = await sequelize.models.Account.findOne({
          where: { email: row.email }
        });

        if (!existingUser) {
          const hashedPassword = await bcrypt.hash(row.password, 10);
          await sequelize.models.Account.create({
            ...row,
            password: hashedPassword
          });
        }
      })
      .on('end', () => {
        logger.info("CSV imported successfully");
      });
  } catch (error) {
    logger.error("Error occured while importing CSV");
  }
}

module.exports = importCSV;
