const controller = require('../controllers/assignment_controller.js');
const router = require('express').Router();

/**
 * @openapi
 * /v1/assignment:
 *  get:
 *      summary: Use to request all assignments
 *      responses:
 *          '200':
 *           description: A successful response
 *          '401':
 *           description: Unauthorized
 *          '403':
 *           description: Forbidden
 */
router.get('/', controller.getAllAssignments);

/**
 * @openapi
 * /v1/assignment/{Id}:
 *  get:
 *      summary: Use to request an assignment by ID
 *      parameters:
 *        - in: path
 *          name: Id
 *          required: true
 *          description: Assignment ID
 *          schema:
 *            type: integer
 *          responses:
 *             '200':
 *              description: OK
 *             '401':
 *              description: Unauthorized
 *             '403':
 *              description: Forbidden
 */
router.get('/:id', controller.getAssignment);

/**
 * @openapi
 * /v1/assignment:
 *  post:
 *      summary: Use to create a new assignment
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateAssignment'
 *      responses:
 *          '201':
 *           description: Assignment created successfully
 *          '400':
 *           description: Bad request, check your request payload
 */
router.post('/', controller.createAssignment);

/**
 * @openapi
 * /v1/assignment:
 *  put:
 *      summary: Use to update a assignment
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Assignment'
 *      responses:
 *          '201':
 *           description: Assignment updated successfully
 *          '400':
 *           description: Bad request, check your request payload
 */
router.put('/:id', controller.updateAssignment);

/**
 * @openapi
 * /v1/assignment/{Id}:
 *  delete:
 *      summary: Use to delete an assignment by ID
 *      parameters:
 *        - in: path
 *          name: Id
 *          required: true
 *          description: Assignment ID
 *          schema:
 *            type: integer
 *          responses:
 *             '200':
 *              description: OK
 *             '401':
 *              description: Unauthorized
 *             '403':
 *              description: Forbidden
 */
router.delete('/:id', controller.deleteAssignment);

router.use('/',controller.assignmentCheckMiddleware);

router.post('/:id/submission',controller.createSubmission);

module.exports = router;