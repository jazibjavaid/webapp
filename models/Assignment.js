const { DataTypes } = require('sequelize');
const db = require('../connection.js');

/**
@openapi
*components:
*  schemas:
*    Assignment:
*      type: object
*      properties:
*        id:
*          type: string
*          format: uuid
*          description: The unique identifier for the assignment.
*        name:
*          type: string
*          description: The name of the assignment.
*        points:
*          type: integer
*          description: The number of points for the assignment.
*        num_of_attempts:
*          type: integer
*          description: The maximum number of attempts allowed for the assignment.
*        deadline:
*          type: string
*          format: date-time
*          description: The deadline for the assignment.
*        assignment_created:
*          type: string
*          format: date-time
*          description: The timestamp when the assignment was created.
*        assignment_updated:
*          type: string
*          format: date-time
*          description: The timestamp when the assignment was last updated.
*        accountId:
*          type: string
*          format: uuid
*          description: The unique identifier of the associated account.
*/

const Assignment = db.define('Assignment', {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: DataTypes.STRING,
    points: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 10
        }
    },
    num_of_attempts: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 100
        }
    },
    deadline: DataTypes.DATE,
    assignment_created: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    assignment_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    accountId: {
        type: DataTypes.UUID,
        references: {
          model: 'Accounts',
          key: 'id'
        }
    }
}, {
    timestamps: false
});


module.exports = Assignment
