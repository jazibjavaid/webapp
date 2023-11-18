const { DataTypes } = require('sequelize');
const db = require('../connection.js');
const Assignment = require('./Assignment.js');


const Submission = db.define('Submission', {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    assignment_id: {
        type: DataTypes.UUID,
        references: {
          model: 'Assignments',
          key: 'id'
        },
        onDelete: 'CASCADE'
    },
    submission_url: DataTypes.STRING,
    submission_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    assignment_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
});

module.exports = Submission