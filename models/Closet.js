var keystone = require('keystone');
var Types = keystone.Field.Types;
var deepPopulate = require('mongoose-deep-populate')(keystone.mongoose);

/**
 * Closet Model
 * ============
 */

var Closet = new keystone.List('Closet', {
});

Closet.add({
  name: { type: Types.Name, required: true },
  email: { type: Types.Email },
  password: { type: Types.Text },
  status: { type: Types.Select, options: [
    { value: 'active', label: 'Closet active' },
    { value: 'notified', label: 'Closet sent to person' },
    { value: 'selected', label: 'Closet items selected' },
    { value: 'delivered', label: 'Closet delivered' }
  ], default: 'active' },
  createdAt: { type: Date, default: Date.now },
});
Closet.relationship({path: 'garments', ref: 'Garment', refPath: 'closet'});

Closet.schema.plugin(deepPopulate);
Closet.defaultSort = '-createdAt';
Closet.defaultColumns = 'name, email, status, createdAt';
Closet.register();
