const { readdirSync } = require("fs");
const path = require("path");
const express = require('express');
const app = express();
const helmet = require('helmet');
const mongoose = require("mongoose");
const reteLimit = require('express-rate-limit')
const MongoSanitize = require("express-mongo-sanitize");
require("dotenv").config();
const morgan = require("morgan");
const cors = require('cors');



// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(MongoSanitize())
app.use(express.json({limit: '50mb'}));

app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(helmet())

// routes middleware
readdirSync("./routes").map(r => app.use("/api/v1", require(`./routes/${r}`))) 

//Db connection
mongoose.set('strictQuery', true);

mongoose.connect(process.env.DATABASE)
.then(()=>{
    console.log("DB is connected");
}).catch((err)=>{
    console.log("db is not connected");
    console.log(err.message);
    process.exit(1);
})

//home route

//rateLimit
const limiter = reteLimit.rateLimit({
    windowMs: 15*60*1000, //15min
    delayMs: 0,
    max: 100
})
app.use(limiter)


//unknown routes
app.use((req, res, next)=>{
    res.status(404).json({
        status: false,
        message: "not found"
    })
})

//err handlers

app.use((err, req, res, next)=>{
    if (err) {
        res.status(401).json({
            status: false,
        message: "something broke"
        })
    } else {
        res.status(401).json({
            status: false,
        message: "something broke"
        })
    }
})


module.exports = app;

