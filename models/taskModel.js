const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
    },
    email: {
        type: String,
    },
    createdDate:{type:Date,default:Date.now()}
}, {versionKey:false})

const taskModel = new mongoose.model("tasks", taskSchema)
module.exports = taskModel;