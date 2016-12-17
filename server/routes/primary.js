const dbModels = require('../../db/index.js');
const utils = require('../utils.js');
const url = require('url');

module.exports = function(app){
  app.get('/', function(req, res, next) {
    res.redirect('/index.html');
  });

  app.get('/create', function(req, res, next) {
    res.redirect('/createEvent.html');
  });

  app.get('/user', function(req, res, next) {
    var accountName = req.query.accountName;
    dbModels.User
    .findOne({
      where: {accountName: accountName}
    })
    .then(function(data) {
      if (data) {
        // user was found
        res.end(JSON.stringify(data));
      } else {
        // user was not found
        res.end(JSON.stringify(
          {notFound: accountName + ' not found'}));
      }
    });
  });

  // New user
  app.post('/user', function(req, res, next) {
    dbModels.User
    .create({
      accountName: req.body.accountName,
      displayName: req.body.displayName,
      phoneNumber: req.body.phoneNumber,
      pw: req.body.pw
    })
    .then(function(user) {
      res.redirect('/')
    })
    .catch(function(error) {
      console.log('Error in posting user to server', error);
      next(error);
    })
  });

  // post an event to table
  app.post('/event', function(req, res, next) {
    dbModels.Event
    .create({
      name: req.body.name,
      description: req.body.description,
      where: req.body.where,
      when: req.body.when
    })
    .then(function(event) {
      res.redirect('/');
    })
    .catch(function(err) {
      console.log('Error: ', err);
      next(error);
    });
  });

  // update an event in table

  // For a given user, get all their attending events
  app.get('/attendingEvents', function(req, res, next) {
    var accountName = '"' + req.query.accountName + '"';

    // raw mysql query syntax
    var queryString ='SELECT \
                        e.name, \
                        e.description, \
                        e.where, \
                        e.when \
                      FROM users as attendee \
                        INNER JOIN eventattendees as ea ON (attendee.id = ea.userId) \
                        INNER JOIN events as e ON (ea.eventId = e.id) \
                      WHERE attendee.accountName = ';
    queryString = queryString.concat(accountName);

    dbModels.sequelize.query(queryString, { type: dbModels.sequelize.QueryTypes.SELECT})
    .then(function(events) {
      console.log('EVENTS FROM SERVER', events);
      res.end(JSON.stringify(events));
    })
    .catch(function(error) {
      console.log('serverside error in GET /eventTable');
      next(error);
    })
  });

  // add a user as an 'attendee' to an event
  app.post('/attendingEvents', function(req, res, next) {
    var accountName = '"' + req.body.accountName + '"';
    var eventName = '"' + req.body.eventName + '"';
    var queryString ='INSERT INTO eventattendees (eventId, userId) \
                      SELECT \
                        event.id, user.id \
                      FROM users AS user \
                      INNER JOIN events AS event \
                        ON user.accountName = ' + accountName +
                      ' AND event.name = ' + eventName;
    dbModels.sequelize.query(queryString, { type: dbModels.sequelize.QueryTypes.INSERT })
    .then(function(success) {
      console.log('POST successful');
      res.end(JSON.stringify(success));
    })
    .catch(function(error) {
      console.log('POST Error', error);
      next(error);
    });
  })

  // For a given user, get all their planning events
  app.get('/planningEvents', function(req, res, next) {
    var accountName = '"' + req.query.accountName + '"';

    // raw mysql query syntax
    var queryString ='SELECT \
                        e.name, \
                        e.description, \
                        e.where, \
                        e.when \
                      FROM users as planner \
                        INNER JOIN eventplanners as ea ON (planner.id = ea.userId) \
                        INNER JOIN events as e ON (ea.eventId = e.id) \
                      WHERE planner.accountName = ';
    queryString = queryString.concat(accountName);

    dbModels.sequelize.query(queryString, { type: dbModels.sequelize.QueryTypes.SELECT})
    .then(function(events) {
      res.end(JSON.stringify(events));
    })
    .catch(function(error) {
      console.log('serverside error in GET /eventTable');
      next(error);
    })
  });

  // add a user as a 'planner' for an event
  app.post('/planningEvents', function(req, res, next) {
    var accountName = '"' + req.body.accountName + '"';
    var eventName = '"' + req.body.eventName + '"';
    var queryString ='INSERT INTO eventplanners (eventId, userId) \
                      SELECT \
                        event.id, user.id \
                      FROM users AS user \
                      INNER JOIN events AS event \
                        ON user.accountName = ' + accountName +
                      ' AND event.name = ' + eventName;
    dbModels.sequelize.query(queryString, { type: dbModels.sequelize.QueryTypes.INSERT })
    .then(function(success) {
      console.log('POST successful');
      res.end(JSON.stringify(success));
    })
    .catch(function(error) {
      console.log('POST Error', error);
      next(error);
    });
  });
}