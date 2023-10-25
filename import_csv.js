const fs = require('fs');
const csv = require('csv-parser');
const { sequelize } = require('./models/Account.js');
const bcrypt = require('bcrypt');

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
        console.log('CSV import completed.');
      });
  } catch (error) {
    console.log('Error importing CSV');
  }
}

module.exports = importCSV;
