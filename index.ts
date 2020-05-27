import Client, { Box, LogSeverity } from "logreio";
import { Request, Response, NextFunction } from "express";

export type LogData = {
  startAt: number | null;
  endAt: number | null;
  duration: number | null;
  statusCode: number | null;
  route: string | null;
  method: string | null;
  protocol: string | null;
  path: string | null;
  host: string | null;
  ip: string | null;
  message: string | null;
  url: string | null;
};

const initialLogData: LogData = {
  startAt: null,
  endAt: null,
  duration: null,
  statusCode: null,
  route: null,
  method: null,
  protocol: null,
  path: null,
  host: null,
  ip: null,
  message: null,
  url: null,
};

export default (box: Box) => {
  const logger = new Client(box);
  let logData: LogData = initialLogData;

  return (req: Request, res: Response, next: NextFunction) => {
    const originalResEnd = res.end;

    logData.startAt = new Date().getTime();
    logData.method = req.method.toUpperCase();
    logData.protocol = req.protocol;
    logData.path = req.path;
    logData.host = req.hostname;
    logData.ip = req.ip;
    logData.url = `${logData.protocol}://${logData.host}${logData.path}`;

    res.end = (...params: any) => {
      res.end = originalResEnd;
      res.end(...params);

      logData.statusCode = res.statusCode;

      if (logData.startAt) {
        logData.endAt = new Date().getTime();
        logData.duration = logData.endAt - logData.startAt;
      }

      try {
        const isSuccessCode =
          logData.statusCode >= 200 && logData.statusCode < 400;
        const isFatalCode = logData.statusCode >= 500;

        if (isSuccessCode) {
          logger.info({
            ...logData,
            message: getMessage(LogSeverity.info, logData),
          });
        } else if (!isFatalCode) {
          logger.error({
            ...logData,
            message: getMessage(LogSeverity.error, logData),
          });
        } else {
          logger.fatal({
            ...logData,
            message: getMessage(LogSeverity.error, logData),
          });
        }
      } catch {}
    };

    next();
  };
};

function getMessage(severity: LogSeverity, logData: LogData) {
  return `${severity.toUpperCase()} ${logData.statusCode} on ${
    logData.method
  } "${logData.path}"`;
}
