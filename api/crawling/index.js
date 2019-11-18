const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/', controller.index);
router.get('/:ServiceNM', controller.index);

// router.get("/crawlingTest", controller.show);
// router.get("/dbconn", controller.databases);
router.post('/insert', controller.post);
router.post('/select', controller.post);
router.post('/update', controller.update);
router.post('/api', controller.api);

module.exports = router;
