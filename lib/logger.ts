import pino from 'pino';

const getPinoConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    level: isProduction ? 'info' : 'debug',
    transport: !isProduction
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  };
};

const createClientLogger = () => {
  const noop = () => {};
  const isDev = process.env.NODE_ENV !== 'production';

  return {
    debug: isDev ? console.debug.bind(console, '[CLIENT DEBUG]') : noop,
    info: console.info.bind(console, '[CLIENT INFO]'),
    warn: console.warn.bind(console, '[CLIENT WARN]'),
    error: console.error.bind(console, '[CLIENT ERROR]'),
    fatal: console.error.bind(console, '[CLIENT FATAL]'),
    trace: noop,
  };
};
export const logger = typeof window === 'undefined' ? pino(getPinoConfig()) : createClientLogger();
