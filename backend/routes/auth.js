require("dotenv").config();
const express = require('express');
const nodemailer = require("nodemailer");
const { body, validationResult, matchedData } = require('express-validator');
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");

const router = express.Router();

//Route-1]Creating a user using post: "api/auth/createuser", No login required
router.post("/createuser",[
    body('name','Name should have atleast 3 characters').isLength({min: 3}),
    body('email',"Email should be valid").isEmail(),
    body('password','Password should have atleast 5 characters').isLength({min: 6})
 ], async (req,res)=>{
    let success = false;
    const errors = validationResult(req);
    const data = matchedData(req)

    
    if(!errors.isEmpty())
    {
        return res.status(400).json({ errors: errors.array() })
    }
    
    try {
        
        //checking if user with this email already exists
        let user = await User.findOne({email: data.email})
        if(user)
            {
                return res.status(400).json({ success, error: "This email is already used!"})
            }
        //Hashing
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(data.password, salt)
        //Storing
        user = await User.create({
            name: data.name,
            email: data.email,
            password: secPass
        })
        //Giving a JWT token
        const data_jwt = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data_jwt, process.env.JWT_SECRET);
        success = true;
        res.json({ success ,authToken});

    } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
        
    // const user = User(req.body)
    // user.save(); // we used this to send data to mongodb without using express validator
})

//Route-2]Authenticating a user using post: "api/auth/login", No login required
router.post("/login",[
    body('email',"Email should be valid").isEmail(),
    body('password','Please enter a password').exists()
 ], async (req,res)=>{
    let success=false //this becomes true if the user is authentic
    const errors = validationResult(req);
    const data = matchedData(req)
    //Validation of the data
    if(!errors.isEmpty())
    {
        return res.status(400).json({ success, errors: errors.array() })
    }

    const {email, password} = data;
    try {
        //Confirming the email
        const user = await User.findOne({email})
        if(!user)
        {
            return res.status(400).json({ success, error: "Please enter the correct credentials"})
        }
        //Confirming the password
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare)
        {
            return res.status(400).json({ success, error: "Please enter the correct credentials"})
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        success = true
        res.json({success ,authToken});
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Route-3]Get user details using post: "api/auth/getuser", Login required
router.get("/getuser", fetchuser, async (req,res)=>{
    
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Route-4]Generate Reset Code: "api/auth/genresetcode", Login not Required
router.put("/genresetcode", async (req, res)=>{
    // Request would have just an email
    let success = false;
    try {
        const email = req.body.email;
        const user = await User.findOne({email: email});
        if(!user)
        {
            return res.status(400).json({ success, error: "Email Not Found!"})
        }
        else
        {
            // Code for sending email
            const a=100000;
            const b=1000000;
            const resetCode = Math.floor(a + Math.random()*(b-a));
            //The passresetcode is 0 by default, now we will change it to some rand value and then send it to the mail of the user, even if somebody knows that the passrestcode is 0 in the DB and tries to change the password it wont work because we wont change the password if passresetcode is 0, and even if somebody tries to send a passrestcode while creating a user then even in that case the passresetcode will not be included in the DB cuz there is no such code to put passresetcode in DB in the createuser route

            // Send Password Reset Code to the User
            recipientMailAddr = email;
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // Use `true` for port 465, `false` for all other ports
                auth: {
                  user: process.env.GMAIL_EMAIL,
                  pass: process.env.GMAIL_APP_PASS,
                },
              });
              
              // async..await is not allowed in global scope, must use a wrapper
              let rejected = []; // to know if the email was rejected
              const sendMailFunc = async ()=> {
                // send mail with defined transport object
                const info = await transporter.sendMail({
                  from: '"NoteCloud" <starmailservice0047@gmail.com>', // sender address
                  to: recipientMailAddr, // list of receivers
                  subject: "Password Recovery Code", // Subject line
                  text: `Password Reset Code For Your NoteCloud Account: ${resetCode}\nCode Expires in 3 Minutes\n\n-NoteCloud`, // plain text body
                  html: `<h2>Password Reset Code For Your NoteCloud Account: ${resetCode}</h2><h3>Code Expires in 3 Minutes</h3>-NoteCloud`, // html body
                });
              
                console.log("Message sent: %s", info.accepted);
                rejected = info.rejected // this is an array of unsuccessfully sent emails, in our case just a single email can stay in this array, if this array is empty then it means that email was sent.
              }
              
              sendMailFunc().catch(console.error);
              // Send mail code ends here
              if(rejected.length == 0) // If email was sent
                {
                    // Save resetCode in DB
                    user.passresetcode = resetCode;
                    user.save();
                    // resetCode can work only for 3 minutes
                    setTimeout(() => {
                      user.passresetcode = 0;
                        user.save();
                    }, 180000);
      
                  success=true;
                  res.status(200).send({success, message: "Successfully Sent Reset Code To Email!"});
                }
                else
                {
                    res.status(500).send({success: false, error: "Can not send the Reset Code to email"});
                }
        }
        
    } catch (error) {
        res.status(500).send({success, error: "Internal Server Error"});
        console.log(error);
    }
})
//Route-5]Reset Password with help of Reset Code: "api/auth/resetpass", Login not Required
router.put("/resetpass", async (req, res)=>{ // will work only if we have the reset code(forgotton password case)
    // Request would have an email, newPassword and reset code
    let success = false;
    try {
        const email = req.body.email;
        const receivedResetCode = req.body.resetCode;
        const newPass = req.body.newPassword;
        const user = await User.findOne({email:email});
        if(!user) return res.status(401).send({success, error: "User with this Email Not Found!"});
        else
        {
            if(user.passresetcode === 0) res.status(403).send({success, error: "Password reset code expired or not generated!"});
            else
            {
                const userResetCode = user.passresetcode;
                if(receivedResetCode != userResetCode) res.status(401).send({success, error: "Password Reset Code is not Matching!"});
                else
                {
                    // Hashing
                    const salt = await bcrypt.genSalt(10);
                    const secPass = await bcrypt.hash(newPass, salt)
                    // Saving in DB
                    user.password = secPass;
                    user.passresetcode = 0;
                    user.save();
                    // Sending Response
                    success = true;
                    res.status(200).send({success, message: "Password Reset Successfully"});
                }
            }
        }
        
    } catch (error) {
        res.status(500).send({success, error: "Internal Server Error"});
        console.log(error);
    }
})
//Route-6]Change Password: "api/auth/changepass", Login Required
router.put("/changepass", fetchuser, async (req, res) =>{
    // Request would have an oldPass, newPass and an authToken
    let success = false;
    const claimedCurrentPass = req.body.currentPass;
    const newPass = req.body.newPass;
    try {
        const user = await User.findById(req.user.id);
        const userOldPass = user.password; // This one is in the form of hash
        const passwordCompare = await bcrypt.compare(claimedCurrentPass, userOldPass);
        if(!passwordCompare) res.status(401).send({success, error: "Old Password Not Matching!"});
        else
        {
            // Hashing
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(newPass, salt);
            // Saving in DB
            user.password = secPass;
            user.save();
            // Sending Response
            success = true;
            res.status(200).send({success, message: "Password Changed Successfully!"});
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({success, error: "Internal Server Error"});
    }
})

module.exports = router;