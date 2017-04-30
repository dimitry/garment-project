var keystone = require('keystone');

var send = require('gmail-send')({
  user: 'thegarmentproject@gmail.com',
  pass: 'BiggerLife'
});

exports.index = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;
  locals.section = 'closet';
  locals.isClosetActive = (locals.closet.status == 'active');
  locals.isClosetNotified = (locals.closet.status == 'notified');
  locals.isClosetActiveNotified = (locals.closet.status == 'active' || locals.closet.status == 'notified');
  locals.selectedGarments = locals.garments.filter(function(garment) {
    return garment.selected;
  });
  locals.totalSelectedGarments = locals.selectedGarments.length;
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
    req.flash('error', {detail: 'Oops, looks like your username or password was incorrect.'});
    return res.redirect('/closets/' + res.locals.closet.id + '/login');
  }
};

exports.logout = function (req, res) {
  req.session.closetSignedIn = false;
  req.session.closetId = null;
  return res.redirect('/closets/' + res.locals.closet.id + '/login');
};

exports.submit = function (req, res) {
  // Select Garments
  req.body.garments.forEach(function(garmentId) {
    var garments = res.locals.garments.filter(function(garment) {
      return garment.id == garmentId;
    });
    if (garments.length > 0) {
      garments[0].selected = true;
      garments[0].save();
    }
  });

  // Update closet status
  res.locals.closet.status = 'selected';
  res.locals.closet.save();

  // Dispatch email
  var body = [
    res.locals.closet.name.first + '\'s closet has been submitted with the following items:',
    ''
  ];
  res.locals.garments.forEach(function(garment) {
    if (garment.selected) {
      body.push('- ' + garment.name + ' (#' + garment.sku + ')');
    }
  });
  body.push('');
  body.push('Closet id: ' + res.locals.closet.id);
  send({
    to: 'thegarmentproject@gmail.com',
    subject: 'Garment closet has been submitted!',
    text: body.join('\n')
  }, function (err, res) {
    if (err) {
      console.log('Email error:', err);
      res.json({success: false});
    } else {
      res.json({success: true});
    }
  });

  res.json({success: true});
};

exports.notify = function (req, res) {
  // Update closet status
  res.locals.closet.status = 'notified';
  res.locals.closet.save();

  // Logout
  req.session.closetSignedIn = false;
  req.session.closetId = null;

  // Dispatch email
  send({
    to: res.locals.closet.email,
    subject: 'Your closet is ready!',
    text: 'Bro, do you even garment?'
  }, function (err, res) {
    if (err) {
      console.log('Email error:', err);
      res.json({success: false});
    } else {
      res.json({success: true});
    }
  });
};