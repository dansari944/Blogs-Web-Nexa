const { format, createLogger, transports } = require("winston");
require("winston-daily-rotate-file");
const path = require("path");

// IST timestamp
const timeZoned = () =>
  new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

// Custom formatter
const logFormat = format.printf(
  ({ timestamp, level, message, context, other, ...rest }) => {
    const safeContext = context ?? "GENERAL";

    // Handle Error as message
    if (message instanceof Error) {
      message = `${message.message}\n${message.stack}`;
    }

    // Handle error inside rest
    if (rest.error instanceof Error) {
      rest.error = {
        message: rest.error.message,
        stack: rest.error.stack,
      };
    }

    // stringify message object
    if (typeof message === "object" && message !== null) {
      message = JSON.stringify(message, null, 2);
    }

    // stringify other
    const formattedOther =
      typeof other === "object" && other !== null
        ? JSON.stringify(other, null, 2)
        : other ?? "N/A";

    const infoLog = `Context: ${safeContext} , other: ${formattedOther}`;

    return `${timestamp} ${level.toUpperCase()}
  ${infoLog}
  Message: ${message}
  ${
    Object.keys(rest).length
      ? JSON.stringify(rest, null, 2)
      : ""
  }`;
  }
);

// Filters
const infoFilter = format((info) =>
  info.level === "info" ? info : false
);
const errorFilter = format((info) =>
  info.level === "error" ? info : false
);

// Logger Factory
const logger = ({ } = {}) => {
  const basePath = process.env.LOGPATH || path.join(__dirname, "logs");

  return createLogger({
    format: format.combine(format.timestamp({ format: timeZoned })),
    transports: [
      new transports.DailyRotateFile({
        filename: path.join(basePath, "Info", "%DATE%.log"),
        datePattern: "DD-MM-YYYY",
        maxSize: "20m",
        maxFiles: "14d",
        level: "info",
        format: format.combine(infoFilter(), logFormat),
      }),
      new transports.DailyRotateFile({
        filename: path.join(basePath, "Error", "%DATE%.log"),
        datePattern: "DD-MM-YYYY",
        maxSize: "20m",
        maxFiles: "14d",
        level: "error",
        format: format.combine(errorFilter(), logFormat),
      }),
    ],
    exitOnError: false,
  });
};

module.exports = logger;