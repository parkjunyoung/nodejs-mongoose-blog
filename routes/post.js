var express	= require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var uploadDir = path.join( __dirname , '../uploads' );
var PostModel = require('../model/post');
var fs = require('fs');



router.get('/', function(req, res, next){
	PostModel.find( function(err , post){
		res.render('post/list' , { 'postList' : post });
	});
});

router.get('/detail/:id', (req, res, next) => {
	PostModel.findOne( { 'id' :  req.params.id } , (err ,post) => {
		res.render('post/detail', {'post': post } );
	});

});

router.get('/write', function(req, res, next){
	var post = [];
	res.render('post/edit', { 'post' : post });

});

router.post(
	'/write', 
	multer({ dest: '/tmp/upload/'}).single('upload_file'), 
	function(req, res, next){

		var insert_file_name = (req.file) ? Date.now() + '_' + req.file.originalname : "";
		
		var post = new PostModel({
			title : req.body.title,
			content : req.body.content,
			upload_file : insert_file_name,
		});

		post.save(function(err){
			if(req.file){ //파일이 업로드 일시 
				var outputPath = uploadDir + '/' + insert_file_name;
				fs.rename(req.file.path , outputPath, function (err) {
	                if (err) {
	                    res.send('err');
	                    throw err;
	                }else{
	                	console.log("file upload success");
	                	res.redirect("/post");
	                }
	            });
			}else{ //파일업로드가 아닐시
				console.log("save success");
				res.redirect("/post");
			}

		}); //post save end

	}
);

router.get('/edit/:id', function(req, res, err){
	PostModel.findOne( {id : req.params.id} , function(err, post){
		if(err){
			console.log(err);
		}else{
			res.render('post/edit', { 'post' : post } );
		}

	});

});

router.post('/edit/:id' , multer({ dest: '/tmp/upload/'}).single('upload_file'), function(req, res, err){

	//먼저 파일검색을 한다.
	PostModel.findOne( {id : req.params.id} , function(err, post){
		if(err){
			console.log(err);
		}else{

			//기존 파일업로드가 아닐시 그전 db에서 파일명을 가져온다.
			var insert_file_name = (req.file) ? Date.now() + '_' + req.file.originalname : post.upload_file;

			var query = {
				title : req.body.title,
				content : req.body.content,
				upload_file : insert_file_name,
			};

			//업데이트를 한다.
			PostModel.update( { id : req.params.id} , { $set : query },function(err){

				if(err){
					console.log("update fail");
					console.log(err);
				}else{

					if(req.file){ //파일이 업로드 일시 
						var outputPath = uploadDir + '/' + insert_file_name;
						fs.rename(req.file.path , outputPath, function (err) {
			                if (err) {
			                    res.send('err');
			                    throw err;
			                }else{
			                	console.log("file upload success");
			                	res.redirect('/post/detail/' + req.params.id );
			                }
			            });
					}else{ //파일업로드가 아닐시
						console.log("save success");
						res.redirect('/post/detail/' + req.params.id );
					}
				}
			}); //post update end
		}
	}); //post find end


});

router.get('/delete/:id', function(req, res, err){
	PostModel.remove({id : req.params.id} , function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect("/post");
		}

	});

});


module.exports = router;



