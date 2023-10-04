const Assignment = require('../models/Assignment.js');
const { validationResult, body } = require('express-validator');
const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

exports.getAllAssignments = (req, res, next) => {
    const accountId = req.user.id;
    if (Object.keys(req.body).length > 0 || Object.keys(req.query).length > 0) {
        return res.status(400).json({ message: 'Request body not allowed' });
    }

    Assignment.findAll()
              .then(assignments => {
                res.status(200).json({ assignments: assignments });
              })
              .catch(err => {
                res.status(400).send({
                    message: err.message || "Some error occurred"
                });
                console.log(err);
            });
}

exports.getAssignment = (req, res, next) => {
    const assignmentId = req.params.id;
    const accountId = req.user.id;
    if (Object.keys(req.body).length > 0) {
        return res.status(400).json({ message: 'Request body is not allowed' });
    }
    // Check if assignmentId is a valid UUID
    if (!uuidRegex.test(assignmentId)) {
        return res.status(400).json({ message: 'Invalid UUID format for assignmentId' });
    }
    Assignment.findByPk(assignmentId)
              .then(assignment => {
                if(!assignment) {
                    return res.status(404).json({ message: 'Assignment not found' });
                }
                res.status(200).send(assignment);
            })
            .catch(err => {
                res.status(400).send({
                    message: err.message || "Some error occurred"
                });
                console.log(err);
            });
}

exports.createAssignment = [
    // Define validation rules for your fields
    body('name').notEmpty().withMessage('Name is required'),
    body('points').notEmpty().withMessage('Points is required'),
    body('num_of_attempts').notEmpty().withMessage('Points is required'),
    body('points')
      .isInt({ min: 1, max: 10 })
      .withMessage('Points must be between 1 and 100'),
    body('num_of_attempts')
      .isInt({ min: 1, max: 100 })
      .withMessage('Points must be between 1 and 100'),
    body('deadline').notEmpty().isISO8601().withMessage('Deadline is required and must be in ISO8601 format'),

    (req, res, next) => {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const assignment = {
        name: req.body.name,
        points: req.body.points,
        num_of_attempts: req.body.num_of_attempts,
        deadline: req.body.deadline,
        assignment_created: req.body.assignment_created,
        assignment_updated: req.body.assignment_updated,
        accountId: req.user.id
      };
  
      Assignment.create(assignment)
        .then(result => {
          res.status(201).json({
            message: 'Assignment created successfully',
            assignment: result
          });
        })
        .catch(err => {
          res.status(400).send({
            message: err.message || 'Some error occurred'
          });
          console.log(err);
        });
    },
  ];


exports.updateAssignment = (req, res, next) => {
    const assignmentId = req.params.id;
    const allowedFields = ['name', 'points', 'num_of_attempts', 'deadline'];
    const accountId = req.user.id; 

    // Filter req.body to only include allowed fields
    const updatedFields = {};
    for (const field of allowedFields) {
        if (req.body.hasOwnProperty(field)) {
            updatedFields[field] = req.body[field];
        }
    }

    // Check if any of the required fields are undefined
    const requiredFields = ['name', 'points', 'num_of_attempts', 'deadline'];
    for (const field of requiredFields) {
        if (updatedFields[field] === undefined) {
            return res.status(400).json({ message: `Field '${field}' is required` });
        }
    }

    // Add validation rules for specific fields
    if (!uuidRegex.test(assignmentId)) {
        return res.status(400).json({ message: 'Invalid UUID format for assignmentId' });
    }

    if (updatedFields.points !== undefined && (updatedFields.points < 1 || updatedFields.points > 10)) {
        return res.status(400).json({ message: 'Invalid value for points' });
    }

    if (updatedFields.num_of_attempts !== undefined && (updatedFields.num_of_attempts < 1 || updatedFields.num_of_attempts > 100)) {
        return res.status(400).json({ message: 'Invalid value for num_of_attempts' });
    }

    Assignment.findByPk(assignmentId)
        .then(assignment => {
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if the assignment belongs to the user
        if (assignment.accountId !== accountId) {
            return res.status(403).json({ message: 'You do not have permission to update this assignment' });
        }

        // Update the assignment
        Assignment.update(updatedFields, {
            where: { id: assignmentId }
        })
            .then(result => {
            console.log('Assignment updated successfully');
            return res.status(204).json({
                message: 'Assignment updated successfully'
            });
            })
            .catch(err => {
            res.status(400).send({
                message: err.message || "Some error occurred"
            });
            console.log(err);
            });
        })
        .catch(err => {
        res.status(400).send({
            message: err.message || "Some error occurred"
        });
        console.log(err);
        });
}

exports.deleteAssignment = (req, res, next) => {
    const assignmentId = req.params.id;
    const accountId = req.user.id; 
    if (!uuidRegex.test(assignmentId)) {
        return res.status(400).json({ message: 'Invalid UUID format for assignmentId' });
    }
    if (Object.keys(req.body).length > 0) {
        return res.status(400).json({ message: 'Request body is not allowed' });
    }
    Assignment.findByPk(assignmentId)
        .then(assignment => {
        if(!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        if (assignment.accountId !== accountId) {
            return res.status(403).json({ message: 'You do not have permission to delete this assignment' });
        }
        return Assignment.destroy({
            where: {
                id: assignmentId
            }
        });
    })
    .then(result => {
        return res.status(204).json({ message: 'User deleted'});
    })
    .catch(err => {
        res.status(400).send({
            message: err.message || "Some error occurred"
        });
        console.log(err);
    });
}