import fs from 'fs';
import path from 'path';
import winston, {Logger} from 'winston';
import mkdirp from 'mkdirp';

const logPath = path.join(__dirname, '../../', 'log'),
    infoLogFile = path.join(logPath, 'log-info.log'),
    errorLogFile = path.join(logPath, 'log-error.log');

if (!fs.existsSync(logPath)) {
    mkdirp.sync(logPath);
}

const logger = new Logger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transports: [
        new (winston.transports.File)({
            name: 'info-file',
            filename: infoLogFile,
            maxsize: 100 * 1024 * 1024,
            level: 'info',
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: errorLogFile,
            maxsize: 100 * 1024 * 1024,
            level: 'error',
        }),
        new (winston.transports.Console)({
            level: 'info',
            colorize: true
        }),
        new (winston.transports.Console)({
            name: 'warn-file',
            filename: errorLogFile,
            maxsize: 100 * 1024 * 1024,
            level: 'warning',
            colorize: true
        }),
    ]
});

export default logger;

