const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

// Test database connection
prisma.$connect()
    .then(() => {
        console.log('Database connection established');
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1);
    });

module.exports = prisma;