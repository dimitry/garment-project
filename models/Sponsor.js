var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Sponsor Model
 * =============
 */

var Sponsor = new keystone.List('Sponsor', {
  defaultSort: 'sortOrder'
});

Sponsor.add({
  name: {type: String, required: true},
  sortOrder: {type: Types.Number, default: 0, required: true},
  image: {
    type: Types.S3File,
    s3path: '/sponsors',
    filename: function(item, filename) {
      var extension = filename.split('.').pop().toLowerCase();
      return item._id + '.' + extension;
    }
  },
  createdAt: {type: Date, default: Date.now}
});

Sponsor.defaultColumns = 'name, order|5%'
Sponsor.register();
