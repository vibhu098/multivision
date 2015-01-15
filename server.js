var express = require("express"),
	stylus=require("stylus"),
	logger = require('express-logger'),
	bodyParser = require('body-parser'),
	mongoose=require('mongoose'),
  	app     = express(),
  	env     = process.env.NODE_ENV=process.env.NODE_ENV || "development",
  	port    = parseInt(process.env.PORT, 10) || 8080;

function compile(str,path){
	return stylus(str).set('filename',path);
}

app.use(stylus.middleware(
		{
			src:__dirname + '/public',
			compile:compile		
		}
	));

app.use(express.static(__dirname + '/public'));
app.use(logger({path: "logfile.txt"}));
app.use(bodyParser.json());
app.set("views",__dirname+"/server/views");
app.set("view engine","jade");

if(env==="development")
{
	mongoose.connect('mongodb://localhost/multivision');
} else {
	mongoose.connect('mongodb://vibhu:multivision@ds031691.mongolab.com:31691/multivision');
}
var db=mongoose.connection;
db.on('error',console.error.bind(console,'error in connection'));
db.on('open',function callback(){
	console.log('connection is done');
});

var messageSchema=mongoose.Schema({message:String});
var Message=mongoose.model('Message',messageSchema);
var mongoMessage;
Message.findOne().exec(function (err,messageDoc){
mongoMessage=messageDoc.message;
});
app.get("/partials/:partialPath",function(req,res){
	res.render('partials/'+req.params.partialPath);
});

app.get("*",function(req,res){
	res.render('index',{
		mongoMessage:mongoMessage
	});
});

app.listen(port);
console.log('Now serving the app at http://localhost:' + port + '..');
