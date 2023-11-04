const Account = require('../models/Account.js');
const bcrypt = require('bcrypt');
const { logger } = require('../logger.js');

function basicAuthenticator(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    logger.error("User did not provide the Auth credentials");
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const credentials = Buffer.from(authHeader.substring('Basic '.length), 'base64').toString().split(':');
  const email = credentials[0];
  const password = credentials[1];

  Account.findOne({ where: { email: email } })
    .then(async(account) => {
        if (!account) {
          logger.error("Invalid Email");
          return res.status(401).json({ message: 'Unauthorized' });
        }

        
        const isPasswordValid = await bcrypt.compare(password, account.password);

        if (!isPasswordValid) {
          logger.error("Password didn't match");
          return res.status(401).json({ message: 'Unauthorized' });
        }

        
        req.user = account;
        next();
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occurred'
      });
      console.log(err);
    });
}

module.exports = basicAuthenticator;
