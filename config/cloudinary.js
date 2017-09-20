var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dohahub',
  api_key: '428156152464563',
  api_secret: 'joQgtptaogiQ0Ze2aXukQHNnkQw'
});

module.exports = cloudinary;
