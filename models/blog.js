var mongoose = require('mongoose'),
    blogSchema = new mongoose.Schema({
        name : String,
        image : String,
        description : String,
        ingredients : String,
        procedure : String,
        additionalTips : String,
        comments : [
            {
                type:mongoose.Schema.Types.ObjectId,
                ref : "Comment"
            }
        ]
    })
    module.exports = mongoose.model('Blog',blogSchema)