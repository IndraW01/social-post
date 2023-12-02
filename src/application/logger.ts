import winston from "winston";

export const logger: winston.Logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.prettyPrint()
      ),
    }),
    new winston.transports.File({
      filename: "logger/logger.log",
      level: "error",
    }),
  ],
});

export default logger;
