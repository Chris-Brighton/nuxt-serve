const winston = require('winston')
const { format } = require('winston')
const { combine, label, printf, colorize, json } = format
const myFormat = printf(({ level, message, label }) => {
  return `[${label}] ${level}: ${message}`
})

const logger = winston.createLogger({
  level: 'info',
  format: combine(colorize({ all: true }), json()),
})
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      colorize: true,
      format: combine(label({ label: 'nuxt-serve' }), myFormat),
    })
  )
}
module.exports = logger
