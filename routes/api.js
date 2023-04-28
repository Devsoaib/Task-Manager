const express = require('express');
const { register, login, updateProfile, profileDetails, RecoverVerifyEmail, RecoverVerifyOTP, RecoverResetPass } = require('../controllers/userController');
const { checkLogin } = require('../middlewares/authVerify');
const { createTask, deleteTask, updateTaskStatus, listTaskByStatus, taskStatusCount } = require('../controllers/taskController');
const router = express.Router();


//user router
router.post("/register", register)
router.post("/login", login)
router.put("/updateProfile", checkLogin, updateProfile)
router.get("/profileDetails", checkLogin, profileDetails)



router.get("/RecoverVerifyEmail/:email", RecoverVerifyEmail);
router.get("/RecoverVerifyOTP/:email/:otp", RecoverVerifyOTP);
router.post("/RecoverResetPass",RecoverResetPass);



//task router
router.post("/createTask", checkLogin, createTask)
router.delete("/deleteTask/:id", checkLogin,  deleteTask)
router.get("/updateTaskStatus/:id/:status", checkLogin, updateTaskStatus)
router.get("/listTaskByStatus/:status", checkLogin, listTaskByStatus)
router.get("/taskStatusCount", checkLogin, taskStatusCount)





module.exports = router;
