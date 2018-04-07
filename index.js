var express = require('express');
var app = express();
var md5 = require('crypto-md5');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index')
});

var mongoose = require('mongoose');
var parser = require('body-parser');

mongoose.connect('mongodb://admin:admin@ds231229.mlab.com:31229/heroku_9150nsl9');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
console.log("connected to mongo");
});


// schema for price database

var pricesSchema = new mongoose.Schema(
    {
        date:Date,
        open:Number,
        high:Number,
        low:Number,
    close:Number,
    volume: Number,
    name:String

    }


    );


   var Prices = mongoose.model('Price',pricesSchema);

    app.use(parser.json());
  app.use(parser.urlencoded({extended: true}));

// Yassin: I finshed C
app.get('/api/prices/:month/:name',function (req,resp)
  {
     var start = new Date(2017, req.params.month-1, 1);
     var end = new Date(2017, req.params.month-1, 31);
   
  Prices.find({name:req.params.name, date:{$gte: start, $lt: end} }, function(err, data) {
  if (err) {
  resp.json({ message: 'Unable to connect to prices' });

  } else {
        
      // return json retrived by Mongo as response
      resp.json(data);
      console.log(data);
    }//end of else
  }); //end of retive
  //end function
  }//closing get
);//closing get

//Yassin : I finished F
app.get('/api/price/latest/:name',function (req,resp)
  {
     
Prices.find({name:req.params.name}).sort({date: -1}).limit(1).exec( function(err, data) {
  if (err) {
  resp.json({ message: 'Unable to connect to prices' });

  } else {
        
      // return json retrived by Mongo as response
      resp.json(data);
      console.log(data);
    }//end of else
  })});
  
  
  
//Yassin : I finished E
app.get('/api/price/:date/:name',function (req,resp)
  {
     var start = new Date(req.params.date);

   
  Prices.find({name:req.params.name, date:{$eq: start} }, function(err, data) {
  if (err) {
  resp.json({ message: 'Unable to connect to prices' +start});

  } else {
        
      // return json retrived by Mongo as response
      resp.json(data);
      console.log(data);
    }//end of else
  }); //end of retive
  //end function
  }//closing get
);//closing get

   app.get('/api/prices', function (req,resp)
  {
    // use mongoose to retrieve all books from Mongo
  Prices.find({}, function(err, data) {
  if (err) {
  resp.json({ message: 'Unable to connect to prices' });

  } else {

      // return json retrived by Mongo as response
      resp.json(data);
      console.log(data)
    }//end of else
  }); //end of retive
  //end function
  }//closing get
);//closing get

//C. Given a stock symbol and a month,
//return the price information for each day in the specified month

//Still not working on it!!!!
/*
app.get('/api/prices/:date/:name', function (req,resp)
{
 // use mongoose to retrieve all books from Mongo
Prices.find({name : req.params.name,
date: new RegExp(req.params.date)},
{$:1})

.exec(function(err, data)
{
if(err){
resp.json({ message: 'Unable to connect to prices' });
    }
else {
   // return json retrived by Mongo as response
   resp.json(data);
   console.log("price and month wor")
 }
});//end of else

});//closing get

*/
//Yassin: I finished D 

app.get('/api/average/prices/:name',function (req,resp)
  {
     
   //aggregate({$match: {name: "AMZN"}}, {$group: {_id:"$name", avg:{$sum:1}}})
  Prices.aggregate([{   '$match' : { name:req.params.name } },{$group : {_id : {month: {$month:"$date"}}, close : {$avg : "$close"}}}, 
  {$sort: {_id: 1}}], function(err, data) {
  if (err) {
  resp.json({ message: 'Unable to connect to prices' ,err});

  } else {
        
      // return json retrived by Mongo as response
      resp.json(data);
      console.log(data);
    }//end of else
  }); //end of retive
  //end function
  }//closing get
);//closing get



/*Given a stock symbol and a month, return the price information for each day in
//the specified month. Some days (weekends and holidays)
//have no data, so this service will likely return some 15-20 price objects.

app.get('/api/prices/:symb', function (req,resp)
{
 // use mongoose to retrieve all books from Mongo
Prices.find({name: req.params.symb}, function(err, data) {
if (err) {
resp.json({ message: 'Unable to connect to prices' });

} else {

   // return json retrived by Mongo as response
   resp.json(data);
   console.log(data)
 }//end of else
}); //end of retive
//end function
}//closing get
);//closing get

yassin was here
*/


// schema and code for the companies table //////////////////

var companiesSchema = new mongoose.Schema(
    {
    symbol:String,
    name:String,
    sector:String,
    subindustry:String,
    address:String,
    date_added:Date,
    CIK:Number,
    frequency:Number

    }


    );


   var Companies = mongoose.model('Company',companiesSchema);

  app.use(parser.json());
  app.use(parser.urlencoded({extended: true}));


   app.get('/api/companies', function (req,resp)
  {
    // use mongoose to retrieve all books from Mongo
  Companies.find({}, function(err, data) {
  if (err) {
  resp.json({ message: 'Unable to connect to companies' });

  } else {

      // return json retrived by Mongo as response
      resp.json(data);
      console.log("data")
    }//end of else
  }); //end of retive
  //end function
  }//closing get
);//closing get



// B) Given a stock symbol, return the company information for it.
app.get('/api/company/:symInfo', function (req,resp)
{
 // use mongoose to retrieve all books from Mongo
Companies.find({symbol: req.params.symInfo}, function(err, data) {
if (err) {
resp.json({ message: 'Unable to connect to company' });

} else {

   // return json retrived by Mongo as response
   resp.json(data);
   console.log(data)
 }//end of else
}); //end of retive
//end function
}//closing get
);//closing get

//Yassin: I finished i
app.get('/api/companies/information', function (req,resp)
  {
    // use mongoose to retrieve all books from Mongo
  Companies.find({},{name:1,symbol:1, _id:0}, function(err, data) {
  if (err) {
  resp.json({ message: 'Unable to connect to companies' });

  } else {

      // return json retrived by Mongo as response
      resp.json(data);
      console.log("data")
    }//end of else
  }); //end of retive
  //end function
  }//closing get
);




// schema and code for the portfolio table //////////////////

var portfolioSchema = new mongoose.Schema(
    {
       id:Number,
    symbol:String,
    user:Number,
    owned:Number

    }


    );


   var Portfolio = mongoose.model('Portfolio',portfolioSchema);

    app.use(parser.json());
  app.use(parser.urlencoded({extended: true}));



// Yassin: I finished H 

app.get('/api/portfolioPercentage/:user', function (req,resp)
  {
      var x = parseInt(req.params.user);
      
    // use mongoose to retrieve all books from Mongo
  Portfolio.aggregate([{   $match: {user: x} }, { $group: { _id:"$symbol",total:{$sum: "$owned"}} }]).exec( function(err, data) {
  if (err) {
  resp.json({ message: 'Unable to connect to portfolios' });

  } else {

    var totalStocks =0; 
        for (let x in data){
            totalStocks += data[x].total;
        }
        var y =0;
    for (let x in data){
        
        data[x].total = (data[x].total/totalStocks);
         y +=data[x].total ;
    }
      resp.json(data);
     console.log(y);
    }//end of else
  }); //end of retive
  //end function
  }//closing get
);




   app.get('/api/portfolio', function (req,resp)
  {
    // use mongoose to retrieve all books from Mongo
  Portfolio.find({}, function(err, data) {
  if (err) {
  resp.json({ message: 'Unable to connect to companies' });

  } else {

      // return json retrived by Mongo as response
      resp.json(data);
      console.log(data);
    }//end of else
  }); //end of retive
  //end function
  }//closing get
);//closing get

//Yassin: I finished G
//Given a user id, return all the portfolio information for that user. 
//A given company can appear multiple times in a user’s 
//portfolio (perhaps representing separate individual purchases).
app.get('/api/portfolioInfo/:user', function (req,resp)
  {
    // use mongoose to retrieve all books from Mongo
  Portfolio.find({user:req.params.user}).sort({symbol:1}).exec( function(err, data) {
  if (err) {
  resp.json({ message: 'Unable to connect to portfolios' });

  } else {
        
        
      // return json retrived by Mongo as response
      resp.json(data);
      console.log(data);
    }//end of else
  }); //end of retive
  //end function
  }//closing get
);//closing get

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

/////////////////////////////////////////////////////////////////////////////

//schema for user table
var userSchema = new mongoose.Schema(
    {
        id:Number,
       first_name:String,
    last_name:String,
    email:String,
    salt:String,
    password:String

    }


    );


   var User = mongoose.model('User',userSchema);

    app.use(parser.json());
  app.use(parser.urlencoded({extended: true}));

//Yassin : i finished A
   app.post('/api/user/login', function (req,resp)
  {
    // use mongoose to retrieve all books from Mongo
  User.find({email:req.body.userEmail}, function(err, data) {
  if (err) {
  resp.send({ message: 'Unable to connect to companies' });

  } else {

if (data.length ===1){
        var attemptedPass = req.body.password + data[0].salt;
        var attemptedPassMd5= md5(attemptedPass,'hex'); 
        if(attemptedPassMd5 == data[0].password){
            let info = { id:data[0].id,
       first_name:data[0].first_name,
    last_name:data[0].last_name};
            resp.send({ info});
        }
        else {
            resp.send({ message: 'wrong password' });
        }
}
      else {
          
          resp.send({ message: 'wrong email' });
      }
        //md5('foobar', 'hex');
      // return json retrived by Mongo as response
      //resp.json(attemptedPass);
      //console.log(data)
    }//end of else
  }); //end of retive
  //end function
  }//closing get
);//closing get

// group chat :

// Abdullah :


//Given a stock symbol, return the average close value for each month in the year
//db.prices.aggregate({$match: {name: "AMZN"}}, {$group: {_id:"$name", avg:{$sum:1}}})



