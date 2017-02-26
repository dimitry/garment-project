var keystone = require('keystone');
var Types = keystone.Field.Types;
var deepPopulate = require('mongoose-deep-populate')(keystone.mongoose);

/**
 * Static Page Model
 * =================
 */

var StaticPage = new keystone.List('StaticPage', {
  map: {name: 'title'},
  plural: 'StaticPages',
  nocreate: true
});

StaticPage.add({
  title: {type: String, required: true, intial: true},
  home: {
    sponsors: {type: Types.Relationship, ref: 'Sponsor', many: true},
    title: {type: Types.Text, note: 'Page title.'},
    hero: {type: Types.Textarea, note: 'Page description under the title.'},
    donate: {
      title: {type: Types.Text},
      paragraph: {type: Types.Textarea}
    }
  },
  about: {
    hero: {
      image: {
        type: Types.S3File,
        s3path: '/static/about',
        filename: function(item, filename) {
          var extension = filename.split('.').pop().toLowerCase();
          return item._id + '_hero_image.' + extension;
        }
      },
      title: {type: Types.Text},
      text1: {type: Types.Textarea},
      text2: {type: Types.Textarea},
      supporting_image: {
        type: Types.S3File,
        s3path: '/static/about',
        filename: function(item, filename) {
          var extension = filename.split('.').pop().toLowerCase();
          return item._id + '_hero_supporting_image.' + extension;
        }
      },
    },
    quote1: {
      background: {
        type: Types.S3File,
        s3path: '/static/about',
        filename: function(item, filename) {
          var extension = filename.split('.').pop().toLowerCase();
          return item._id + '_quote1_bg.' + extension;
        },
      },
      quote: {type: Types.Text}
    },
    block1: {
      title: {type: Types.Text},
      paragraph1: {type: Types.Textarea},
      paragraph2: {type: Types.Textarea},
    },
    quote2: {
      background: {
        type: Types.S3File,
        s3path: '/static/about',
        filename: function(item, filename) {
          var extension = filename.split('.').pop().toLowerCase();
          return item._id + '_quote2_bg.' + extension;
        },
      },
      quote: {type: Types.Text}
    },
    block2: {
      title: {type: Types.Text},
      paragraph1: {type: Types.Textarea},
      paragraph2: {type: Types.Textarea},
    },
    quote3: {
      background: {
        type: Types.S3File,
        s3path: '/static/about',
        filename: function(item, filename) {
          var extension = filename.split('.').pop().toLowerCase();
          return item._id + '_quote3_bg.' + extension;
        },
      },
      quote: {type: Types.Text}
    },
    block3: {
      image: {
        type: Types.S3File,
        s3path: '/static/about',
        filename: function(item, filename) {
          var extension = filename.split('.').pop().toLowerCase();
          return item._id + '_block3.' + extension;
        },
      },
      title: {type: Types.Text},
      paragraph1: {type: Types.Textarea},
      paragraph2: {type: Types.Textarea}
    }
  }
  // facilities:{
  //   introduction:{type: Types.Html, wysiwyg: true, dependsOn: {page: 'Facilities'}},
  //   bannerImage: {type: Types.Relationship, ref: 'Image', note: 'The image which appears at the top of the page.', dependsOn: {page: 'Facilities'}},
  //   bannerText: {type: Types.Text, note: 'This text will appear overlaying the banner image.', dependsOn: {page: 'Facilities'} }
  // },
  // team:{
  //   introduction:{type: Types.Html, wysiwyg: true, dependsOn: {page: 'Team'}},
  //   bannerImage: {type: Types.Relationship, ref: 'Image', note: 'The image which appears at the top of the page.', dependsOn: {page: 'Team'}},
  //   bannerText: {type: Types.Text, note: 'This text will appear overlaying the banner image.', dependsOn: {page: 'Team'} }
  // },
  // help:{
  //   introduction:{type: Types.Html, wysiwyg: true, dependsOn: {page: 'Help'}},
  //   bannerImage: {type: Types.Relationship, ref: 'Image', note: 'The image which appears at the top of the page.', dependsOn: {page: 'Help'}},
  //   bannerText: {type: Types.Text, note: 'This text will appear overlaying the banner image.', dependsOn: {page: 'Help'}},
  //   faq: {
  //     thumbnailTitle: {type: Types.Text, note: 'This is the title which will appear on the FAQ thumbnail Text ', dependsOn:{page: 'Help'}},
  //     thumbnailText: {type: Types.Text, note: 'This is the text which will appear on the FAQ thumbnail Text ', dependsOn:{page: 'Help'}},
  //     thumbnailImage: {type: Types.Relationship, ref: 'Image', note: 'This image will be used for the thumnail linking to the FAQ page.', dependsOn:{page: 'Help'}},
  //   }
  // },
  // gallery: {
  //   introduction: {type: Types.Html, wysiwyg: true, dependsOn: {page: 'Gallery'}},
  //   bannerImage: {type: Types.Relationship, ref: 'Image', note: 'The image which appears at the top of the page.', dependsOn: {page: 'Gallery'}},
  //   bannerText: {type: Types.Text, note: 'This text will appear overlaying the banner image.', dependsOn: {page: 'Gallery'}},
  // },
  // faq: {
  //   introduction:{type: Types.Html, wysiwyg: true, dependsOn: {page: 'FAQ'}},
  //   bannerImage: {type: Types.Relationship, ref: 'Image', note: 'The image which appears at the top of the page.', dependsOn: {page: 'FAQ'}},
  //   bannerText: {type: Types.Text, note: 'This text will appear overlaying the banner image.', dependsOn: {page: 'FAQ'}},
  // },
  // about:{
  //   introduction:{type: Types.Html, wysiwyg: true, dependsOn: {page: 'About'}},
  //   bannerImage: {type: Types.Relationship, ref: 'Image', note: 'The image which appears at the top of the page.', dependsOn: {page: 'About'}},
  //   bannerText: {type: Types.Text, note: 'This text will appear overlaying the banner image.', dependsOn: {page: 'About'}},
  // },
  // contact:{
  //   introduction:{type: Types.Html, wysiwyg: true, dependsOn: {page: 'Contact'}},
  //   bannerImage: {type: Types.Relationship, ref: 'Image', note: 'The image which appears at the top of the page.', dependsOn: {page: 'Contact'}},
  //   bannerText: {type: Types.Text, note: 'This text will appear overlaying the banner image.', dependsOn: {page: 'Contact'}},
  // }
});

StaticPage.schema.plugin(deepPopulate);
StaticPage.defaultColumns = 'title';
StaticPage.register();