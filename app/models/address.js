var mongoose = require('mongoose');
var schema = mongoose.Schema({key : JSON}),
    Json = mongoose.model('JSON', schema),
    toSave = new Json({key : '/home/hashtag/Desktop/app/converted.json'});

toSave.save(function(err){
   'use strict';
   if (err) {
       throw err;
   }
   console.log('woo!');
})
	


module.exports = mongoose.model('Addr', schema);