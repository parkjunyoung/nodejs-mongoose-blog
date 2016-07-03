var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var PostSchema = new Schema({
	title : String,
	content : String,
	upload_file : String,
	created_at : { type : Date , default : Date.now }
});

PostSchema.plugin( autoIncrement.plugin , { model : 'Post' , field : 'id' , startAt : 1 } );
module.exports = mongoose.model('post' , PostSchema);



