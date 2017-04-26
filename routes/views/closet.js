var keystone = require('keystone');

exports.index = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;
  locals.section = 'closet';
  view.render('closets/index');
};

exports.login = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;
  locals.section = 'closet';
  view.render('closets/login');
};

exports.loginProcess = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;
  locals.section = 'closet';

  if (req.body.password === res.locals.closet.password) {
    req.session.closetSignedIn = true;
    req.session.closetId = res.locals.closet.id;
    return res.redirect('/closets/' + res.locals.closet.id);
  } else {
    req.flash('error', {detail: 'Invalid password.'});
    return res.redirect('/closets/' + res.locals.closet.id + '/login');
  }
};

exports.logout = function (req, res) {
  req.session.closetSignedIn = false;
  req.session.closetId = null;
  return res.redirect('/closets/' + res.locals.closet.id + '/login');
};