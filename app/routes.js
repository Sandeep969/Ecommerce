var user = require('./models/user');
var Addr = require('./models/address');
var mongoose = require('mongoose');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("h");
});

exports.test = function(req,res) {
  res.render('test');
};



module.exports = function(app, passport){

	app.get('/', function(req, res){

		res.render('index.ejs');
	});

	app.get('/login', function(req, res){
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.get('/signup', function(req, res){
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});


	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	app.get('/details', isLoggedIn, function(req, res){
		res.render('details.ejs', { user: req.user });
	});
	
	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.ejs', { user: req.user });
	});
	app.get('/profile2', isLoggedIn, function(req, res){
		res.render('profile2.ejs', { user: req.user });
	});
	app.get('/home', isLoggedIn, function(req, res){
		res.render('home.ejs', { user: req.user });
	});

	app.get('/edit',isLoggedIn, function(req, res){
      res.render('edit.ejs',{user: req.user});

	} );
      app.get('/', isLoggedIn, function(req, res){
		res.render('details.ejs', { user: req.user });
	});

      app.post('/validate', function(req, res){
         var pincode = req.body.pincode;
         
         var user1 = req.user.google.id.toString();
         var city = req.body.city;
         var state = req.body.state.toString();;
         var pin = pincode.toString();
         var city = city.toString();
         var mobile = req.body.mobile.toString();;
         var dob = req.body.dob.toString();;
         var flat = req.body.flat.toString();;
         
         var addr = {
            pin   : pin,
            city : city,
            state : state,
            flat : flat,
            dob : dob,
            mobile: mobile


         }

     
    if(pin){


         var collection = db.collection("address");
         	collection.find({"Address": {"$elemMatch": {"pincode":pin, "Deliverystatus":"1"}}}).toArray(function(err,docs){
         	if(err){
         		res.json(err);
         	}

         	else if(docs.length > 0){
         		;
         		var collection1 = db.collection("users");
         		collection1.find({"google.id": user1}).toArray(function(err,docs1){
         			if(err){
         		res.json(err);
         	}
         	else if(docs1.length > 0){
         		console.log(docs1.length);
                  collection1.update({"google.id":user1},{"$set":{"address": addr}})

         	}
         		});
                 res.render('home.ejs', { user: req.user});

                
         		
         	}
         	else{
                   
         		res.render('sorry.ejs', { user: req.user });

         	}

         });
         }

         else{
           res.render('details.ejs', { user: req.user });

         }
       


      });
app.post('/submit', function(req, res){
	   var user2 = req.user.google.name;         
         
         var username = req.body.username.toString();
         var email = req.body.email.toString();  
         var city = req.body.city.toString();
         var mobile = req.body.mobile.toString();
         var dob = req.body.dob.toString();
         var flat = req.body.flat.toString();

       
      
     var collection1 = db.collection("users");
                  collection1.update({"google.name": user2},{"$set":{"address.city":city,"address.flat":flat,"address.mobile":mobile,"address.dob":dob,"google.name": username,"google.email": email}});
                  res.render('home.ejs', { user: req.user});

         	
         		});
                 

                
         		
         	
         	
 
	

	app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

	app.get('/auth/google/callback', 
	  passport.authenticate('google', { successRedirect: '/details',
	                                      failureRedirect: '/' }));


	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	})
};

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/login');
}