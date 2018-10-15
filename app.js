var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var passport = require('passport')
var localStrategy = require('passport-local')
var User = require('./models/user')
var Blog = require('./models/blog')
var Comment = require('./models/comment')
var seedDB = require('./seeds')
var methodOverride = require('method-override')
var app = express()

mongoose.connect('mongodb://localhost/SecretRecipe')
app.set('view engine','ejs')
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))
seedDB()

app.use(require('express-session')({
    secret : "Attale",
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    next()
})

//routes
app.get('/',(req,res)=>{
    res.render('home')
})

//index - show all blogs
app.get('/blogs',(req,res)=>{
    Blog.find({},(err,allBlogs)=>{
        if(err) {
            console.log(err)
        } else {
            res.render('blogs/index',{blogs:allBlogs})
        }
    })
})
//create - adding new blog
app.post('/blogs',(req,res)=>{
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var ing = req.body.ingredients
    var proc = req.body.procedure
    var addTips = req.body.additionalTips
    var newBlog = {name: name, image: image, description: desc,ingredients:ing,procedure:proc,additionalTips:addTips}

    Blog.create(newBlog,(err,newlyCreated)=>{
        if(err) {
            console.log(err)
        }
        else {
            res.redirect('/blogs')
        }
    })
   
})

//new - show form
app.get('/blogs/new',(req,res)=>{
    res.render('blogs/new')
})

// show - shows more info about campgrounds
app.get('/blogs/:id',(req,res)=>{
    Blog.findById(req.params.id).populate('comments').exec((err,foundBlog)=>{
      if(err) {
          console.log(err)
      } else {
          console.log(foundBlog)
          res.render('blogs/show',{blog:foundBlog})
      }
    })
})

//comments routes
app.get('/blogs/:id/comments/new',isLoggedIn,(req,res)=>{
    Blog.findById(req.params.id,(err,blog)=>{
        if(err){
            console.log(err)
        }
        else {
            res.render('comments/new',{blog:blog})
        }
    })
})

app.post('/blogs/:id/comments',isLoggedIn,(req,res)=>{
     Blog.findById(req.params.id,(err,blog)=>{
         if(err) {
             console.log(err)
             res.redirect('/blogs')
         } else {
             Comment.create(req.body.comment,(err,comment)=>{
                 if(err){
                   console.log(err)
                 }
                 else {
                     blog.comments.push(comment)
                      blog.save()
                     res.redirect('/blogs/'+blog._id)

                 }
             })
         }
     })
})

//auth routes
//render register form
app.get('/register',(req,res)=>{
    res.render('register')
})

app.post('/register',(req,res)=>{
    var newUser = new User({username:req.body.username})
    User.register(newUser,req.body.password,(err,user)=>{
        if(err) {
            console.log(err)
            res.render('/register')
        }
        passport.authenticate('local')(req,res,()=>{
            res.redirect('/blogs')
        })
    })
})

//login route
app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/login',passport.authenticate('local',{
    successRedirect:'/blogs',
    failureRedirect:'/login'
}),(req,res)=>{

})

//logout
app.get('/logout',(req,res)=>{
    req.logout()
    res.redirect('/blogs')
})

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("blogs/edit", {blog: foundBlog});
        }
    });
})



// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
   // req.body.blog.body = req.sanitize(req.body.blog.body)
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      }  else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
           console.log(err)
       } else {
           res.redirect("/blogs");
       }
   })
   //redirect somewhere
});




app.listen(8016,()=>{
    console.log('port 8016')
}

)

