
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
    createEventSchema,
    updateEventSchema,
    searchEventSchema,
    rsvpSchema
} = require('../validators/event.schema');

router.use(authMiddleware);

router.post('/', validate(createEventSchema), eventController.createEvent);
router.get('/search', validate(searchEventSchema), eventController.searchEvents);
router.get('/:eventId', eventController.getEvent);
router.put('/:eventId', validate(updateEventSchema), eventController.updateEvent);
router.delete('/:eventId', eventController.deleteEvent);
router.post('/:eventId/rsvp', validate(rsvpSchema), eventController.rsvpToEvent);

module.exports = router;