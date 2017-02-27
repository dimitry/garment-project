var keystone = require('keystone');

exports = module.exports = function (req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'home';

  view.on('init', function(next) {
    keystone.list('StaticPage').model.findOne()
      .deepPopulate('home.sponsors', {
        populate:{
          'home.sponsors': {
            options:{
              sort: 'sortOrder'
            }
          }
        }
      })
      .exec(function(err, page) {
        if (err) {
          console.log(err);
          return next(err);
        } else {
          locals.page = page.home;
          next(err);
        }
      });
  });

  // Render the view
  view.render('index');
};
