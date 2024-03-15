const fs = require('fs');
const mongooseLoader = require('./mongoose');
const expressLoader = require('./express');
const logger = require('../config/logger');
const subscribers = require('../subscribers');
const EventEmitter = require('../utils/EventEmitter');

module.exports = async (app) => {
  await mongooseLoader();
  logger.info('Mongoose initiated.');
  await expressLoader(app);
  logger.info('Express app initiated.');

  // since we added it in loader it will listen to it before they are fired
  Object.keys(subscribers).forEach((eventName) => {
    EventEmitter.on(eventName, subscribers[eventName]);
  });
  // check if there is uploads folder  and create one if not exists
  fs.access('uploads', fs.constants.F_OK, async (err) => {
    if (err) {
      await fs.promises.mkdir('uploads');
    }
  });
};
