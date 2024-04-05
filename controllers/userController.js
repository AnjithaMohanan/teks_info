 const User=require('../models/userModel')
const bcrypt=require('bcrypt')
const twilio = require('twilio');
require('dotenv').config(); // Load environment variables

const otpGenerator = require('otp-generator');
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const OtpModel = require('../models/otp')
const sendOtp = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        const cDate = new Date();

        // Update or insert OTP document in the database
        const otpDoc = await OtpModel.findOneAndUpdate(
            { phoneNumber },
            { otp, otpExpiration: new Date(cDate.getTime()) },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Send OTP via Twilio
        await client.verify.v2.services(process.env.TWILIO_VERIFY_SID).verifications.create({ to: phoneNumber, channel: "sms" });

        return res.status(200).json({
            success: true,
            msg: 'OTP sent successfully'
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
};



const verifyOtp = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        // Check OTP entered by the user
        const verification_check = await client.verify.v2.services(verifySid).verificationChecks.create({ to: phoneNumber, code: otp });

        if (verification_check.status === 'approved') {
            return res.status(200).json({
                success: true,
                msg: 'OTP verified successfully'
            });
        } else {
            return res.status(400).json({
                success: false,
                msg: 'Invalid OTP'
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
};









const nodemailer=require('nodemailer')
const securePassword=async(password)=>{
    try{
       const passwordHash= await bcrypt.hash(password,10);
       return passwordHash;

    }catch(error){
        console.log(error.message)
    }

}


//for send emial

const sendVerfiyMail=async(name,email,user_id)=>{
    try{
       const transporter= nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:'anjithamohanan263@gmail.com',
                pass:'cpbk yyuo pouc agns'
            }

        })
        const mailOptions={
            from:'anjithamohanan263@gamil.com',
            to:email,
            subject:'for verification mail',
            html: '<p>Hi ' + name + ', please click <a href="http://localhost:3000/verify?id=' + user_id + '">here</a> to verify your mailOptions.</p>'

        }
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error)
            }else{
                console.log("Email has been sent: ", info.response)
            }

        })
    }catch(error){
        console.log(error.message)

    }
}
const loadRegister=async(req,res)=>{
    try{
        res.render('register')

    }catch(error){
        console.log(error.message)
    }
}


const insertUser = async (req, res) => {
    try {
        const spassword = await securePassword(req.body.password); // Wait for securePassword to resolve
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            password: spassword, // Use the resolved password
            image: req.file.filename,
            is_admin: 0
        });

        const userData = await user.save();
        if (userData) {
            sendVerfiyMail(req.body.name,req.body.email,userData._id)

            res.render('register', { message: "Your registration has been successfully. please verify your email" });
        } else {
            res.render('register', { message: "Your registration has been failed" });
        }
    } catch (error) {
        console.log(error.message);
        res.render('register', { message: "An error occurred during registration" });
    }
};

const verifyMail=async(req,res)=>{
    try{
       const updateInfo=await User.updateOne({_id:req.query.id},{$set:{is_verified:1}})
       console.log(updateInfo)
       res.render("email-verified")

    }catch(error){
        console.log(error.message);
        
    }
}


//login

const loginLoad=async(req,res)=>{
    try{

        res.render('login')

    }catch(error){
        console.log(error.message);
        
    }
}


const verifyLogin = async (req, res) => {
    try {
        const mobile = req.body.mno;
        const password = req.body.password;
        const userData = await User.findOne({ mobile: mobile });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                if (userData.is_verified === 0) {
                     res.render('login', { message: "Please verify your email" });
                } else {
                    req.session.user_id=userData._id;
                     res.redirect('/home');
                }
            } else {
                 res.render('login', { message: 'Mobile and password are incorrect' });
            }
        } else {
             res.render('login', { message: 'Mobile and password are incorrect' });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal Server Error');
    }
};



const loadHome=async(req,res)=>{
    try{
        res.render('home')

    }catch(error){
        console.log(error.message);
        
    }
}
module.exports={
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
     sendOtp,
     verifyOtp
}

