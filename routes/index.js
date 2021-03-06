/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
  views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
  // Main
  app.get('/',        routes.views.index);
  app.get('/about',   routes.views.about);
  app.all('/faq',     routes.views.faq);
  app.all('/terms',   routes.views.terms);
  app.all('/privacy', routes.views.privacy);

  // Closet
  app.get('/closets/:closetId', middleware.requireCloset, middleware.requireClosetUser, routes.views.closet.index);
  app.post('/closets/:closetId/submit', middleware.requireCloset, routes.views.closet.submit);
  app.get('/closets/:closetId/login', middleware.requireCloset, routes.views.closet.login);
  app.post('/closets/:closetId/login', middleware.requireCloset, routes.views.closet.loginProcess);
  app.get('/closets/:closetId/logout', middleware.requireCloset, routes.views.closet.logout);
  app.post('/closets/:closetId/notify', middleware.requireUser, middleware.requireCloset, routes.views.closet.notify);

  // NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
  // app.get('/protected', middleware.requireUser, routes.views.protected);

};
