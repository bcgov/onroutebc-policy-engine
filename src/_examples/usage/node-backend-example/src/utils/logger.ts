interface LogLevel {
  ERROR: 0
  WARN: 1
  INFO: 2
  DEBUG: 3
}

const LOG_LEVELS: LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
}

const currentLogLevel = LOG_LEVELS.INFO

const formatMessage = (level: string, message: string, meta?: any): string => {
  const timestamp = new Date().toISOString()
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : ''
  return `[${timestamp}] ${level}: ${message}${metaStr}`
}

export const logger = {
  error: (message: string, meta?: any): void => {
    if (currentLogLevel >= LOG_LEVELS.ERROR) {
      console.error(formatMessage('ERROR', message, meta))
    }
  },
  
  warn: (message: string, meta?: any): void => {
    if (currentLogLevel >= LOG_LEVELS.WARN) {
      console.warn(formatMessage('WARN', message, meta))
    }
  },
  
  info: (message: string, meta?: any): void => {
    if (currentLogLevel >= LOG_LEVELS.INFO) {
      console.info(formatMessage('INFO', message, meta))
    }
  },
  
  debug: (message: string, meta?: any): void => {
    if (currentLogLevel >= LOG_LEVELS.DEBUG) {
      console.debug(formatMessage('DEBUG', message, meta))
    }
  }
}
