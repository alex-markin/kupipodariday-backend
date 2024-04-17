import * as winston from 'winston';
import * as path from 'path';

const logDir = path.join(__dirname, '..', 'logs');

export const winstonConfig = {
  levels: {
    critical_error: 0,
    error: 1,
    special_warning: 2,
    another_log_level: 3,
    info: 4,
  },
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
  ],
};
