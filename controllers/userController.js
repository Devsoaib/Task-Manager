const jwt = require("jsonwebtoken");
const usersModel = require("../models/usersModel");
const SendEmailUtility = require("../utility/SendEmailUtility");
const OTPModel = require("../models/OTPModel");
const e = require("express");


exports.register = async (req, res) => {
  //destructure name, email and password from req.body
  const { firstName, lastName, email, mobile, password, photo } = req.body;
  try {
    //required validation
    if (!email) {
      return res.json({ error: "email is required" });
    }
    if (!firstName.trim()) {
      return res.json({ error: "FirstName" });
    }
    if (!lastName.trim()) {
      return res.json({ error: "lastname is required" });
    }
    if (!mobile) {
      return res.json({ error: "address is required" });
    }
    if (!password || password.length < 6) {
      return res.json({ error: "password should be at least 6 characters" });
    }

    //check if email is taken
    const existingEmail = await usersModel.findOne({ email });
    if (email === existingEmail) {
      return res.status(500).json({ error: "email is already taken" });
    }

    //insert user
    const insertUser = new usersModel({
      firstName: firstName,
      lastName: lastName,
      email: email,
      mobile: mobile,
      password: password,
      photo: photo,
    });
    //save user
    const userInserted = await insertUser.save();

    res.status(200).json({ userInserted });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    let reqbody = req.body;

    if (!reqbody.email) {
      return res.json({ error: "Email is required" });
    }

    //select user
    const user = await usersModel.aggregate([
      { $match: reqbody },
      {
        $project: {
          _id: 0,
          email: 1,
          firstName: 1,
          lastName: 1,
          mobile: 1,
          photo: 1,
        },
      },
    ]);

    if (user.length > 0) {
      const token = jwt.sign(
        {
          email: user[0].email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        status: "success",
        token: token,
        user: user,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

//update profile
exports.updateProfile = async(req, res) => {
  try {
    const { firstName, lastName, email, mobile, password, photo} = req.body;
      const user = usersModel.find({email: req.email});

      //password check
      // if ( !password || password.length < 6) {
      //     return res.json({error: "password must be at least 6 characters"})
      // }

      const updatedUser = await usersModel.updateOne(req.email, {
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          email: email || user.email,
          password: password || user.password,
          mobile: mobile || user.mobile,
          photo: photo || user.photo
      }, {new: true})
      console.log(updatedUser);
      res.status(200).json({
        status: "success",
        user: updatedUser,
      });
  } catch (error) {
      res.json({error: error.message});
  }
}




exports.profileDetails = async(req, res) => {
  try {
    let { email } = req.user;

    const user = await usersModel.aggregate([
      {$match : {email: email}},
      {$project: {_id:1,email:1,firstName:1,lastName:1,mobile:1,photo:1,password:1}}
    ])

    
    if (user.length > 0) {
      res.status(200).json({ status: "success", data: user });
    } else {
      res.status(200).json({ status: "success", data: "no user found" });
    }
  } catch (error) {
    console.log(error);
    res.json({error: error.message});
  }
}


exports.RecoverVerifyEmail = async (req, res) => {


  let email = req.params.email;
  let OTPCode = Math.floor(100000 + Math.random() * 900000)

  try {
    //email account query
    let userCount = await usersModel.aggregate([{$match: {email: email}}, {$count: "total"}])

    if (userCount.length > 0) {
       // OTP Insert
       let CreateOTP = await OTPModel.create({email: email, otp: OTPCode})
       //email send

       let emailSend = await SendEmailUtility(email, `your OTP is ${OTPCode}`, "Task Manager PIN Verification")

       res.status(200).json({status: "success", data: emailSend})
    }else{
      res.status(200).json({status: "fail", data: "No User Found"})
    }
  } catch (error) {
    res.status(200).json({status: "fail", data:error.message})
  }

}


exports.RecoverVerifyOTP = async(req, res) => {
  let email = req.params.email;
  let OTPCode = req.params.otp;
  let status=0;
  let statusUpdate=1;

  try {
    const OTPCount = await OTPModel.aggregate([{$match: {email: email, otp: OTPCode, status: status}}, {$count: "total"}])

    if (OTPCount.length>0) {
      let OTPUpdate = await OTPModel.updateOne({email: email, otp: OTPCode, status: status}, {
          email: email,
          otp: OTPCode,
          status: statusUpdate
      })
      res.status(200).json({status: "success", data: OTPUpdate})
  } else {
      res.status(200).json({status: "fail", data: "Invalid OTP Code"})
  }
  } catch (error) {
    res.status(200).json({status: "fail", data:error})
  }
}


exports.RecoverResetPass = async (req, res) => {
  let email = req.body['email'];
  let OTPCode = req.body['OTP'];
  let NewPass =  req.body['password'];
  let statusUpdate=1;


  try {
    
    let OTPUsedCount = await OTPModel.aggregate([{$match: {email: email, otp: OTPCode, status: statusUpdate}}, {$count: "total"}])

    if (OTPUsedCount.length>0) {
      let PassUpdate = await usersModel.updateOne({email: email}, {
          password: NewPass
      })
      res.status(200).json({status: "success", data: PassUpdate})
  } else {
      res.status(200).json({status: "fail", data: "Invalid Request"})
  }
  } catch (error) {
    res.status(200).json({status: "fail", data:error.message})
  }
}