const Account = require('./models/account');
const Assignment = require('./models/assignment');

// Define the association between Account and Assignment
Account.hasMany(Assignment, {
    foreignKey: 'accountId' // This should match the name of the column in the Assignment table
});

Assignment.belongsTo(Account, {
    foreignKey: 'accountId' // This should match the name of the column in the Assignment table
});

// You can add more associations here if needed

module.exports = { Account, Assignment };