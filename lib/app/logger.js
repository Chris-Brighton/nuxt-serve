const winston = require('winston')
const { format } = require('winston')
const { combine, label, printf, colorize, json } = format
const myFormat = printf(({ level, message, label }) => {
  return `[${label}] ${level}: ${message}`
})

const consoleTransport = new winston.transports.Console({
  colorize: true,
  format: combine(label({ label: 'nuxt-serve' }), myFormat),
})

const logger = winston.createLogger({
  level: 'info',
  format: combine(colorize({ all: true }), json()),
  transports: [consoleTransport],
})

module.exports = logger
