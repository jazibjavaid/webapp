const Account = require('./models/account');
const Assignment = require('./models/assignment');


Account.hasMany(Assignment, {
    foreignKey: 'accountId' 
});

Assignment.belongsTo(Account, {
    foreignKey: 'accountId'
});



module.exports = { Account, Assignment };