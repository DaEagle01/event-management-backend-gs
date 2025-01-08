const { z } = require('zod');

const createEventSchema = z.object({
    body: z.object({
        title: z.string().min(3, 'Title must be at least 3 characters'),
        description: z.string().min(10, 'Description must be at least 10 characters'),
        startTime: z.string().datetime('Invalid start time format'),
        endTime: z.string().datetime('Invalid end time format'),
        location: z.string().min(3, 'Location must be at least 3 characters')
    })
});

const updateEventSchema = createEventSchema.deepPartial();

const searchEventSchema = z.object({
    query: z.object({
        title: z.string().optional(),
        location: z.string().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        page: z.string().transform(Number).optional(),
        limit: z.string().transform(Number).optional()
    })
});

const rsvpSchema = z.object({
    body: z.object({
        status: z.enum(['going', 'maybe', 'not_going'], {
            errorMap: () => ({ message: 'Status must be either going, maybe, or not_going' })
        })
    })
});

module.exports = {
    createEventSchema,
    updateEventSchema,
    searchEventSchema,
    rsvpSchema
};
