var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Garment Model
 * =============
 */

var Garment = new keystone.List('Garment', {
  drilldown: 'closet',
  sortable: true,
  sortContext: 'Closet:garments'
});

Garment.add({
  name: {type: String, required: true, initial: true},
  sku: {type: String, required: true, initial: true, label: 'SKU'},
  supplier: {type: String, required: false},
  image: {
    type: Types.S3File,
    s3path: '/garments',
    filename: function(item, filename) {
      var extension = filename.split('.').pop().toLowerCase();
      return item._id + '.' + extension;
    }
  },
  size: { type: Types.Select, options: [
    { value: 'xxs', label: 'XX Small' },
    { value: 'xs', label: 'X Small' },
    { value: 's', label: 'Small' },
    { value: 'm', label: 'Medium' },
    { value: 'l', label: 'Large' },
    { value: 'xl', label: 'X Large' },
    { value: 'xxl', label: 'XX Large' }
  ]},
  closet: {type: Types.Relationship, ref: 'Closet'},
  createdAt: {type: Date, default: Date.now}
});

Garment.defaultColumns = 'name, sku, size|15%, closet'
Garment.register();
