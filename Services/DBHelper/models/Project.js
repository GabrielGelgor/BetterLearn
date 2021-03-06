// DB Schema for a project

const mongoose = require('mongoose');
const commentSchema = require('./Comment');
const voteSchema = require('./Vote');
const { Schema } = mongoose;

const projectSchema = new Schema({  
    title : { type : String, required : true},

    owner : { type : String, required : true},

    score : { type : Number, default : 0 },

    contributors : { type : [String], default : [] }, // Non-owner contributors.

    description : { type : String, default : "" },

    voters : { type : [voteSchema], default : [] },

    comments : { type : [commentSchema], default : [] }
})

mongoose.model('projects', projectSchema)