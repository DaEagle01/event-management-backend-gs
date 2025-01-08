
const eventService = require('../services/event.service');

class EventController {
    async createEvent(req, res, next) {
        try {
            const event = await eventService.createEvent(req.user.userId, req.body);
            res.status(201).json({
                status: 'success',
                data: { event }
            });
        } catch (error) {
            next(error);
        }
    }

    async updateEvent(req, res, next) {
        try {
            const event = await eventService.updateEvent(
                req.params.eventId,
                req.user.userId,
                req.body
            );
            res.json({
                status: 'success',
                data: { event }
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteEvent(req, res, next) {
        try {
            await eventService.deleteEvent(req.params.eventId, req.user.userId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async getEvent(req, res, next) {
        try {
            const event = await eventService.getEvent(req.params.eventId);
            res.json({
                status: 'success',
                data: { event }
            });
        } catch (error) {
            next(error);
        }
    }

    async searchEvents(req, res, next) {
        try {
            const result = await eventService.searchEvents(req.query);
            res.json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async rsvpToEvent(req, res, next) {
        try {
            const rsvp = await eventService.rsvpToEvent(
                req.params.eventId,
                req.user.userId,
                req.body.status
            );
            res.json({
                status: 'success',
                data: { rsvp }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new EventController();
