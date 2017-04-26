/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _        = require('lodash');
var keystone = require('keystone');


/**
  Initialises the standard view locals

  The included layout depends on the navLinks array to generate
  the navigation in the header, you may wish to change this array
  or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
  res.locals.navLinks = [
    { label: 'Home', key: 'home', href: '/' },
    { label: 'Gallery', key: 'gallery', href: '/gallery' },
    { label: 'Contact', key: 'contact', href: '/contact' },
  ];
  res.locals.user = req.user;
  next();
};


/**
  Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
  var flashMessages = {
    info: req.flash('info'),
    success: req.flash('success'),
    warning: req.flash('warning'),
    error: req.flash('error'),
  };
  res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
  next();
};


/**
  Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
  if (!req.user) {
    req.flash('error', 'Please sign in to access this page.');
    res.redirect('/keystone/signin');
  } else {
    next();
  }
};

exports.requireCloset = function (req, res, next) {
  if (!req.params.closetId) {
    req.flash('error', 'Closet not found.');
    return res.redirect('/');
  }

  // Find the clost
  keystone.list('Closet').model.findById(req.params.closetId)
    .exec(function(err, closet) {
      if (err) {
        req.flash('error', 'Closet not found.');
        res.redirect('/');
      } else {
        if (closet === null) {
          req.flash('error', 'Closet not found.');
          return res.redirect('/');
        }
        res.locals.closet = closet;

        // Get closet's garments
        keystone.list('Garment').model.where({closet: closet})
          .exec(function(err, garments) {
            res.locals.garments = garments;
            next();
          });
      }
    });
};

exports.requireClosetUser = function (req, res, next) {
  function redirectToLogin() {
    req.flash('error', 'Please sign in to access this page.');
    res.redirect('/closets/' + res.locals.closet.id + '/login');
  }

  if (!req.session.closetSignedIn) {
    return redirectToLogin();
  } else {
    if (req.session.closetId !== res.locals.closet.id) {
      return redirectToLogin();
    }
    next();
  }
};