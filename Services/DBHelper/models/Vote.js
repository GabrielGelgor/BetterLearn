// DB Schema for a vote

const mongoose = require('mongoose');
const { Schema } = mongoose;

const voteSchema = new Schema({

    vote : { type : Number, required : true }, 

    voter : { type : String, required : true },

})

mongoose.model('votes', voteSchema)