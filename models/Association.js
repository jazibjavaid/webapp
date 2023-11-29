const Account = require('./models/account');
const Assignment = require('./models/assignment');
const Submission = require('./Submission.js');


Account.hasMany(Assignment, {
    foreignKey: 'accountId' 
});

Assignment.belongsTo(Account, {
    foreignKey: 'accountId'
});

Assignment.hasMany(Submission, {
    foreignKey: 'assignment_id',
    onDelete: 'CASCADE'
});

Submission.belongsTo(Assignment, { 
    foreignKey: 'assignment_id' 
});

Account.hasMany(Submission, {
    foreignKey: 'accountId' 
});

Submission.belongsTo(Account, { 
    foreignKey: 'accountId' 
});

module.exports = { Account, Assignment, Submission };