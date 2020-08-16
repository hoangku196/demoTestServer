var express = require('express');
var app = express();
var multer = require('multer');
var path = require('path');
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');
var db = require('mongoose');
var methodOverride = require('method-override');
const _PORT = 8888;

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(methodOverride('_method'));
app.use(express.static('uploads'));
app.use(express.static('views'));

app.engine('.hbs', hbs({
	extname: 'hbs',
	defaultLayout: 'main',
	layoutsDir: 'views/layouts',
	partialsDir: 'views/partials'
}));
app.set('view engine', '.hbs');

var mongoDB = 'mongodb+srv://hoangku196:Asdwasdw123@cluster0.wy1wn.mongodb.net/test';

var schema = db.Schema;

db.connect(mongoDB, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}, function(){
	console.log('Connect MongoDB success');
});

const storageConfig = multer.diskStorage({
	destination: function(req, file, callback){
		callback(null, './uploads');
	},
	filename: function(req, file, callback){
		callback(null, req.body.maOto + path.extname(file.originalname));
	}
});
const upload = multer({
	storage: storageConfig,
	fileFilter: function(req, file, callback){
		var ext = path.extname(file.originalname);
		var lengthName = path.basename(file.originalname, ext);
		if(ext !== '.jpg'){
			return callback(new Error('Khong phai anh duoi JPG'));
		}
		if(lengthName.length >= 10){
			return callback(new Error('Ten file qua dai'));
		}
		callback(null, true);
	}
});

app.get('/list', function(req, res){
	var list = db.model(collection, test, 'demotest1');
	var check = list.find({}, function(err, data){
		res.render('list_form', {
			data: data,
			helpers: {
				index_item: function(value){
					return parseInt(value) + 1;
				}
			}
		});
	}).lean();
});

var collection = 'demotest1';
var test = new schema({
	maOto: String,
	nhanHieu: String,
	namSX: Number,
	giaGoc: Number,
	giaBan: Number,
	anhDaiDien: String	
});

app.get('/', function(req, res){

});

app.get('/add', function(req, res){
	res.render('add_form');
});

app.post('/upload', upload.single('myFile'), function(req, res){
	var add = db.model(collection, test);
	var check = add({
		maOto: req.body.maOto,
		nhanHieu: req.body.nhanHieu,
		namSX: req.body.namSX,
		giaGoc: req.body.giaGoc,
		giaBan: req.body.giaBan,
		anhDaiDien: req.file.filename
	}).save(function(err){
		if(err){
			res.send(err);
			return;
		}else{
			res.redirect('/add');
		}
	});
});

app.delete('/list/:id?', function(req, res){
	var deleteItem = db.model(collection, test, 'demotest1');
	var check = deleteItem.deleteOne(
		{
			_id: req.params.id
		},
		function(err){
			res.redirect('/list');
		}
	);
});
app.get('/list/search', function(req, res){
	var list = db.model(collection, test, 'demotest1');
	console.log(req.body.search);
	var check = list.find({nhanHieu: req.body.search}, function(err, data){
		res.render('search_form', {
			data: data,
			helpers: {
				index_item: function(value){
					return parseInt(value) + 1;
				}
			}
		});
	}).lean();
});

app.listen(_PORT, function(){
	console.log('Server is on port ' + _PORT);
});






































