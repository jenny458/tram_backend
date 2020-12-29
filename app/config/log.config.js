const { createLogger, format, transports } = require('winston');
 
const myFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${level}] ${message}`;
});

module.exports = createLogger({
    level: 'info',
    format: format.combine(
      format.splat(),
      format.timestamp(),
      myFormat
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'logs/combined.log' }),
      new transports.File({ filename: 'logs/error.log', level: 'error' }),
    ],
  });;