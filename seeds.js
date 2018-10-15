var mongoose = require('mongoose')
var Blog = require('./models/blog')
var Comment = require('./models/comment')

var data = [
{
    name : "Golden Detox",
    image : "https://skinnyms.com/wp-content/uploads/2012/10/Lemon-Ginger-Detox-Drink-750x500.png",
    description : "Tasty way to lose weight",
    ingredients : "coriander,lemon,cucumber",
    procedure : "add some coriander leaves,cucumber and 1 tbsp of lemon juice ",
    additionalTips : "Add honey for better taste"
  
},
{
    name : "Red Velvet",
    image : "https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn-image.myrecipes.com%2Fsites%2Fdefault%2Ffiles%2Fthe-red-velvet-cake-sl.jpg&f=1",
    description : "",
    ingredients : "curd",
    procedure : "blah blah blah",
    additionalTips : ""
  
}

]

function seedDB() {
    Blog.remove({},(err)=>{
        if(err) {
          console.log(err)
        }
        console.log('removed recipes')
        data.forEach((seed)=>{
            Blog.create(seed,(err,blog)=>{
                if(err) {
                    console.log(err)
                }
                else {
                    console.log('added a blog')
                    Comment.create({
                        text : 'Looks good',
                        author : "Sai Kumar"

                    },(err,comment)=>{
                        if(err) {
                            console.log(err)
                        }
                        else {
                            blog.comments.push(comment)
                            blog.save()
                            console.log('created new comment')
                        }
                    })
                }
            })
        })
    })
}

module.exports = seedDB