var keystone = require('keystone');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;
  locals.section = 'about';

  view.on('init', function(next) {
    keystone.list('StaticPage').model.findOne()
      .exec(function(err, page) {
        if (err) {
          console.log(err);
          return next(err);
        } else {
          locals.page = page.about;
          next(err);
        }
      });
  });

  view.render('about');
};
