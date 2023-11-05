const winston = require('winston');
const { createLogger, transports } = winston;

const logger = createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.json()
    ),
    defaultMeta: {
        service: "webapp",
    },
    transports: [
        new transports.File({ filename: "./logs/errorlogs.log", level: "error" }),
        new transports.File({ filename: "./logs/allapplogs.log" }),
    ],
});

module.exports = { logger, winston };