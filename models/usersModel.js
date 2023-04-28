const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate:{
            validator: (v)=>{
                const emailRegx = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return emailRegx.test(v)
            },
            message: "{VALUE} is not a valid email"
        }
    },
    mobile:{type:String},
    password: {
        type: String,
        required: true,
        min: 6,
        max: 64
    },
    photo:{type:String},
    createdDate:{type:Date,default:Date.now()}
}, {versionKey:false})

const usersModel = mongoose.model('users', userSchema);

module.exports = usersModel;