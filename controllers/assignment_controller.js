const Assignment = require('../models/Assignment.js');
const { validationResult, body } = require('express-validator');
const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const { logger } = require('../logger.js');

exports.getAllAssignments = (req, res, next) => {
    
    if (Object.keys(req.body).length > 0 || Object.keys(req.query).length > 0) {
        logger.error("Payload not allowed for GET request");
        return res.status(400).json({ message: 'Request body not allowed' });
    }

    Assignment.findAll()
              .then(assignments => {
                logger.info("Fetched assignment details successfully");
                res.status(200).json({ assignments: assignments });
              })
              .catch(err => {
                logger.error("Error occurred while fetching data");
                res.status(400).send({
                    message: err.message || "Some error occurred"
                });
                console.log(err);
            });
}

exports.getAssignment = (req, res, next) => {
    const assignmentId = req.params.id;
    
    if (Object.keys(req.body).length > 0) {
        logger.error("Payload not allowed for GET request");
        return res.status(400).json({ message: 'Request body is not allowed' });
    }
    
    if (!uuidRegex.test(assignmentId)) {
        logger.error("Assignment ID is not valid");
        return res.status(400).json({ message: 'Invalid UUID format for assignmentId' });
    }
    Assignment.findByPk(assignmentId)
              .then(assignment => {
                if(!assignment) {
                    logger.error("Assignment not found");
                    return res.status(404).json({ message: 'Assignment not found' });
                }
                logger.info("Fetched assignment details: " + JSON.stringify(assignment));
                res.status(200).send(assignment);
            })
            .catch(err => {
                logger.error("Error occurred while fetching data");
                res.status(400).send({
                    message: err.message || "Some error occurred"
                });
                console.log(err);
            });
}

function checkForExtraFields(req, res, next) {
    const allowedFields = ['name', 'points', 'num_of_attempts', 'deadline', 'assignment_created', 'assignment_updated'];
    const bodyFields = Object.keys(req.body);
  
    const extraFields = bodyFields.filter(field => !allowedFields.includes(field));
  
    if (extraFields.length > 0) {
        logger.error("Extra fields found in the request body");  
        return res.status(400).json({
            message: 'Extra fields found in the request body',
            extraFields,
        });
    }
  
    next();
  }

exports.createAssignment = [
    
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
    body('points').notEmpty().withMessage('Points is required'),
    body('num_of_attempts').notEmpty().withMessage('Points is required'),
    body('points')
      .isInt({ min: 1, max: 10 })
      .withMessage('Points must be between 1 and 100'),
    body('num_of_attempts')
      .isInt({ min: 1, max: 100 })
      .withMessage('Points must be between 1 and 100'),
    body('deadline').notEmpty().isISO8601().withMessage('Deadline is required and must be in ISO8601 format'),

    checkForExtraFields,

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error("Error occurred while adding data");
        return res.status(400).json({ errors: errors.array() });
      }
  
      const assignment = {
        name: req.body.name,
        points: req.body.points,
        num_of_attempts: req.body.num_of_attempts,
        deadline: req.body.deadline,
        accountId: req.user.id
      };
  
      Assignment.create(assignment)
        .then(result => {
            logger.info("Assignment created successfully");  
            res.status(201).json({
                message: 'Assignment created successfully',
                assignment: result
            });
        })
        .catch(err => {
            logger.error("Error occurred while creating assignment");  
            res.status(400).send({
                message: err.message || 'Some error occurred'
            });
            console.log(err);
        });
    },
  ];


exports.updateAssignment = (req, res, next) => {
    const assignmentId = req.params.id;
    const allowedFields = ['name', 'points', 'num_of_attempts', 'deadline', 'assignment_created', 'assignment_updated'];
    const bodyFields = Object.keys(req.body);
    const extraFields = bodyFields.filter(field => !allowedFields.includes(field));
    if (extraFields.length > 0) {
        logger.error("Extra fields found in the request body"); 
        return res.status(400).json({
            message: 'Extra fields found in the request body',
            extraFields,
        });
      }
    const accountId = req.user.id;
  
    const updatedFields = {};
    const requiredFields = ['name', 'points', 'num_of_attempts', 'deadline'];
    for (const field of requiredFields) {
        if (req.body.hasOwnProperty(field)) {
            updatedFields[field] = req.body[field];
        }
    }

    
    for (const field of requiredFields) {
        if (updatedFields[field] === undefined) {
            logger.error("Field " + field + " is missing in the request body"); 
            return res.status(400).json({ message: `Field '${field}' is required` });
        }
    }

    
    if (!uuidRegex.test(assignmentId)) {
        logger.error("Assignment ID is not valid");
        return res.status(400).json({ message: 'Invalid UUID format for assignmentId' });
    }

    if (updatedFields.points !== undefined && (typeof updatedFields.name !== 'string')) {
        logger.error("Invalid value for name field");
        return res.status(400).json({ message: 'Invalid value for name' });
    }

    if (updatedFields.points !== undefined && (updatedFields.points < 1 || updatedFields.points > 10)) {
        logger.error("Invalid value for points field");
        return res.status(400).json({ message: 'Invalid value for points' });
    }

    if (updatedFields.num_of_attempts !== undefined && (updatedFields.num_of_attempts < 1 || updatedFields.num_of_attempts > 100)) {
        logger.error("Invalid value for num_of_attempts field");
        return res.status(400).json({ message: 'Invalid value for num_of_attempts' });
    }

    Assignment.findByPk(assignmentId)
        .then(assignment => {
        if (!assignment) {
            logger.error("Assignment not found");
            return res.status(404).json({ message: 'Assignment not found' });
        }

        
        if (assignment.accountId !== accountId) {
            logger.error("User does not have permission to update the assignment");
            return res.status(403).json({ message: 'You do not have permission to update this assignment' });
        }

        
        Assignment.update(updatedFields, {
            where: { id: assignmentId }
        })
            .then(result => {
            logger.info("Assignment updated successfully"); 
            return res.status(204).json({
                message: 'Assignment updated successfully'
            });
            })
            .catch(err => {
                logger.error("Error occurred while updating the assignment");  
                res.status(400).send({
                    message: err.message || "Some error occurred"
                });
            });
        })
        .catch(err => {
            logger.error("Error occurred while updating the assignment");
            res.status(400).send({
                message: err.message || "Some error occurred"
            });
        });
}

exports.deleteAssignment = (req, res, next) => {
    const assignmentId = req.params.id;
    const accountId = req.user.id; 
    if (!uuidRegex.test(assignmentId)) {
        logger.error("Assignment ID is not valid");
        return res.status(400).json({ message: 'Invalid UUID format for assignmentId' });
    }
    if (Object.keys(req.body).length > 0) {
        logger.error("Payload not allowed for DELETE request");
        return res.status(400).json({ message: 'Request body is not allowed' });
    }
    Assignment.findByPk(assignmentId)
        .then(assignment => {
        if(!assignment) {
            logger.error("Assignment not found");
            return res.status(404).json({ message: 'Assignment not found' });
        }
        if (assignment.accountId !== accountId) {
            logger.error("User does not have permission to delete the assignment");
            return res.status(403).json({ message: 'You do not have permission to delete this assignment' });
        }
        Assignment.destroy({
            where: {
                id: assignmentId
            }
        })
        .then(result => {
            logger.info("Assignment deleted successfully"); 
            return res.status(204).json({ message: 'Assignment deleted'});
        })
    })
    .catch(err => {
        logger.error("Error occurred while deleting the assignment");
        res.status(400).send({
            message: err.message || "Some error occurred"
        });
        console.log(err);
    });
}

exports.assignmentCheckMiddleware = (req, res, next) => {
    if (req.method === 'PATCH') {
        logger.error("PATCH method is not allowed");
        res.status(405).json();
        return;
    }
    next();
}; 