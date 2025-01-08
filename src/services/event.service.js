
const prisma = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

class EventService {
    async createEvent(userId, eventData) {
        return prisma.event.create({
            data: {
                ...eventData,
                ownerId: userId
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    }

    async updateEvent(eventId, userId, eventData) {
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            throw new AppError('Event not found', 404);
        }

        if (event.ownerId !== userId) {
            throw new AppError('Not authorized to update this event', 403);
        }

        return prisma.event.update({
            where: { id: eventId },
            data: eventData,
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    }

    async deleteEvent(eventId, userId) {
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            throw new AppError('Event not found', 404);
        }

        if (event.ownerId !== userId) {
            throw new AppError('Not authorized to delete this event', 403);
        }

        await prisma.event.delete({
            where: { id: eventId }
        });
    }

    async getEvent(eventId) {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                rsvps: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!event) {
            throw new AppError('Event not found', 404);
        }

        return event;
    }

    async searchEvents(searchParams) {
        const {
            title,
            location,
            startDate,
            endDate,
            page = 1,
            limit = 10
        } = searchParams;
        const limitInt = parseInt(limit, 10);
        
        const where = {};

        if (title) {
            where.title = { contains: title, mode: 'insensitive' };
        }

        if (location) {
            where.location = { contains: location, mode: 'insensitive' };
        }

        if (startDate || endDate) {
            where.startTime = {};
            if (startDate) where.startTime.gte = new Date(startDate);
            if (endDate) where.startTime.lte = new Date(endDate);
        }

        const total = await prisma.event.count({ where });
        const events = await prisma.event.findMany({
            where,
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                rsvps: true 
            },
            skip: (page - 1) * limitInt,
            take: limitInt,
            orderBy: {
                startTime: 'asc'
            }
        });

        return {
            events,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limitInt)
            }
        };
    }

    async rsvpToEvent(eventId, userId, status) {
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            throw new AppError('Event not found', 404);
        }

        return prisma.rSVP.upsert({
            where: {
                userId_eventId: {
                    userId,
                    eventId
                }
            },
            update: { status },
            create: {
                userId,
                eventId,
                status
            }
        });
    }
}

module.exports = new EventService();
