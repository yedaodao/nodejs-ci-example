import logger from './logger';

export default function exit(app, server) {
    if (!server || !app) {
        logger.error('Exit with error');
        process.exit(1);
        return false;
    }
    server.close(() => {
        closeHandler(app).then();
    });
}

async function closeHandler(app) {
    try {
        // your handler logic
        process.exit(0);
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
}
