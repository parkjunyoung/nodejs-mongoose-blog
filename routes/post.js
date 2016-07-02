var express	= require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var appDir = path.join( __dirname , '../uploads' );
var PostModel = require('../model/post');
var fs = require('fs');



router.get('/', function(req, res, next){
	PostModel.find( function(err , post){
		console.log(appDir);
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
		var post = new PostModel({
			title : req.body.title,
			content : req.body.content,
		});
		post.save(function(err){
			var outputPath = appDir + '/' + Date.now() + '_' + req.file.originalname;

			fs.rename(req.file.path , outputPath, function (err) {
                if (err) {
                    res.send('err');
                    return;
                }else{
                	console.log(outputPath);

                }

            });

			if(err){
				console.log("save error");
				res.send('create error');
			}else{
				console.log("save success");
				res.redirect("/post");
			}

		});

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

router.post('/edit/:id' , function(req, res, err){
	var query = {
		title : req.body.title,
		content : req.body.content,
	};
	PostModel.update( { id : req.params.id} , { $set : query },function(err){
		if(err){
			console.log("update fail");
			console.log(err);
		}else{
			res.redirect('/post/detail/' + req.params.id );
		}

	});


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

router.get('edit')



module.exports = router;



