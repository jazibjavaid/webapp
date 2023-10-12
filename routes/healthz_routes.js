const express = require('express');
const router = express.Router();
const healthzController = require("../controllers/healthz_controller.js");

router.use('/',healthzController.healthCheckMiddleware);
router.get('/', healthzController.gethealthCheckController);
router.get('/:id', healthzController.gethealthCheckController);


module.exports = router;