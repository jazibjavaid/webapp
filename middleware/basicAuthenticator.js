const Account = require('../models/Account.js');
const bcrypt = require('bcrypt');

function basicAuthenticator(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const credentials = Buffer.from(authHeader.substring('Basic '.length), 'base64').toString().split(':');
  const email = credentials[0];
  const password = credentials[1];

  Account.findOne({ where: { email: email } })
    .then(async(account) => {
        if (!account) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Compare the input password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, account.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Authentication successful; set user information in the request for future use
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
