const winston = require('winston');
require('winston-mongodb');

module.exports = (db) => {
  winston.add(new winston.transports.MongoDB({db}))
  winston.add(new winston.transports.Console(
      {
        format: winston.format.combine(
          winston.format.colorize({all: true}),
          winston.format.simple()
        )
      }))
}