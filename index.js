var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index')
});

app.get('/cool', function(request, response) {
  response.send(cool());
});










var mongoose = require('mongoose');
var parser = require('body-parser');
//
/*
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

  .get('/', (req, res) => res.render('pages/index'))




  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
//---------------------------------------------------------------------

*/
mongoose.connect('mongodb://admin:admin@ds127899.mlab.com:27899/heroku_540jxx2m');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
console.log("connected to mongo");
});


//-------------------------bookSchema

var bookSchema = new mongoose.Schema(

{

id: Number,
isbn10: String,
isbn13: String,
title: String,
year: Number,
publisher: String,
production: {
status: String,
binding: String,
size: String,
pages: Number,
instock: Date
},
category: {
main: String,
secondary: String
}
});

// "compile the schema into a model"
var Book = mongoose.model('book',bookSchema);

app.get('/api/book', function (req,resp)
{
  // use mongoose to retrieve all books from Mongo
Book.find({}, function(err, data) {
if (err) {
resp.json({ message: 'Unable to connect to stock' });

} else {

    // return json retrived by Mongo as response
    resp.json(data);
    console.log(data)
  }//end of else
}); //end of retive
//end function
}//closing get
);//closing get






//----------------------------------Stocks

var stockSchema = new mongoose.Schema(

  {
    Symbol:String,
    Company_Name:String,
    SEC_filings:String,
    Sector:String,
    Sub_Industry:String,
    Address_of_Headquarters:String,
    Date_first_added:String,
    CIK:Number,
    Financials:
    {
      Id:Number,
      Symbol:String,
      Period_Ending:String,
      Accounts_Payable:Number,
      Accounts_Receivable:Number,
      Addl_incomeexpense_items:Number
     },
    Prices:{
    Id: Number,
    Date: String,
    Open: Number,
    High: Number,
    Low: Number,
    Close: Number,
    Volume: String,
    Name: String
  }
  });




  // "compile the schema into a model"
  var Stock = mongoose.model('Stock',stockSchema);



  //Add on the necessary “wiring” for express as follows:
  // create an express app
  //var app = express();
  // tell node to use json and HTTP header features in body-parser
  app.use(parser.json());
  app.use(parser.urlencoded({extended: true}));

  // handle GET requests for [domain]/api/books e.g. return all books
//app.get('/cool', function(request, response) {
//  response.send(cool());
//});

  app.get('/api/stocks', function (req,resp)
  {
    // use mongoose to retrieve all books from Mongo
  Stock.find({}, function(err, data) {
  if (err) {
  resp.json({ message: 'Unable to connect to stock' });

  } else {

      // return json retrived by Mongo as response
      resp.json(data);
      console.log(data)
    }//end of else
  }); //end of retive
  //end function
  }//closing get
);//closing get




app.get('/api/stocks/:symbol', function (req,resp)
{
  // use mongoose to retrieve all books from Mongo
Stock.find({Symbol:req.params.symbol}, function(err, data) {
if (err) {
resp.json({ message: 'Unable to connect to stock' });

} else {

    // return json retrived by Mongo as response
    resp.json(data);
    console.log(data)
  }//end of else
}); //end of retive
//end function
}//closing get
);//cl

  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });


/*
  app.route('/api/stocks/:symbol')
  .get(function(req, resp)
  {
    Stock.find({Symbol:req.params.symbol}, function(err,data)

    {
  if(err)
  {
    resp.json({message: 'Stock not found'});
    console.log("not found ");
  }
  else{

    resp.json(data);
    console.log("It is working");
  }
});
  });

//https://your-domain-here/api/stocks/sector/Industrials
//Returns just the Symbol and Company_Name fields for
//each stock with a matching Sector
/*

app.route('/api/stocks/sector/:sector')
.get(function(req, resp)
{
  Stock.find({Sector:req.params.sector}, {Company_Name:1, Symbol:1,  _id:0},
    //{Id:0,Company_Name:1,Symbol:1})
  //.select ('Company_Name Symbol')
   function(err,data)

  {
if(err)
{
  resp.json({message: 'Stock not found'});
  console.log("not found ");
}
else{

  resp.json(data);
  //resp.json({Id:0});
  console.log("It is working");
}
});
});


/*https://your-domain-here/api/stocks/prices/2015-11-16/AMZN
Returns just the Price objects for specified symbol for the
specified date. Because the price data is an array element,
it is a bit tricky to return just a single sub-element from a s
ub-array. You will need to construct your query using the Mongoose find()
method similar to the following:
.find( { 'Prices.Name': req.params.symb,
'Prices.Date': new RegExp(req.params.date)},
{'Prices.$': 1 },
function(err, data) { ... });
The emphasized text tells MongoDB to return just the specified sub-element.*/

/*
app.route('/api/stocks/prices/:date/:symb')
.get(function(req, resp)
{
  Stock.find({'Prices.Name':req.params.symb,
          'Prices.Date': new RegExp(req.params.date)},
    {'Prices.$':1, '_id':0},

    function(err,data)
    //.select('Price[]')

  {
if(err)
{
  resp.json({message: 'Stock not found'});
  console.log("not found ");
}
else{

  resp.json(data);
  console.log("It is working");
}
});
});







  //wiring code using express to listen to port
  let port = 2222;
  app.listen(port, function()
  {console.log("server is running at port= " + port);
  }
);
*/
