const router = require("express").Router();
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const bcrypt = require("bcrypt");
const nodeMailer = require('nodemailer')
require('dotenv').config()

router.post("/login", async(req, res)=> {
    const db = require("../index").db;
    const username = req.body.username;
    const password = req.body.password;

    db.query("SELECT username, user_password, is_admin FROM Users WHERE username = ?", [username], async (err, result) => {
        if (err) {
            console.error("Query Error: ", err);
            res.status(500).json({ message: "Internal Server Error" });
        } 
        else if (result.length === 0) {
            res.status(401).json({ message: "User does not exist" });
        } 
        else{
            const hashedPassword = result[0].user_password
            const samePassword = await bcrypt.compare(password, hashedPassword);
            if (samePassword) {
                console.log("Login Successful")
                res.status(200).json(result)
            } 
            else {
                console.log("Password Incorrect")
                res.status(401).json({message: "Password Incorrect"})
            } 
        }
    });
});

router.get("/users", async (req, res) => {
    const db = require("../index").db;

    db.query("SELECT * FROM Users", (err, result) => {
        if (err) {
            console.error("Query Error: ", err);
            res.status(500).json({ message: "Internal Server Error" });
        } 
        else if (result.length === 0) {
            res.status(401).json({ message: "No users" });
        }
        else{
            const users = result;
            res.status(200).json(users);
        } 
    });
    
});

router.post("/forget-password", async(req, res) => {
    try{
        const db = require("../index").db;
        const {email, username} = req.body;

        db.query("SELECT * FROM Users WHERE username = ? AND email = ?", [username, email], (err, result) => {
            if (err) {
                console.error("Query Error: ", err);
                res.status(500).json({ message: "Internal Server Error" });
            } 
            else if (result.length === 0) {
                res.status(401).json({ message: "Username/Email does not exist" });
            } 
        });

        const result = await sendMail(email);

        if(result === false){
            res.status(410).json({ message: "Email cannot send" });
        }
        else {
            res.status(202).json({message: "Email sent", data: email, code: result});
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})
    }
});

router.post("/send-email", async (req, res) => {
    const email = req.body.email
    const result = await sendMail(email);

    if(result === false){
        res.status(500).json("Internal Server Error")
    }
    else {
        res.status(202).json({message: "Email sent", code: result});
    }

})

router.post("/auth", async (req, res) => {
    try {
        const {code, hashed_code} = req.body
        
        const valid = await bcrypt.compare(code, hashed_code);
        if (!valid)
            return res.status(401).json({message: "Invalid code"})
        else 
            return res.status(200).json({message: "valid code"})
    }
    catch(err) {
        res.status(500).json({message: "Internal Server Error"})
    }
});

router.post("/reset-password", async(req, res) => {
    try{
        const db = require("../index").db;
        const {password, confirmed_password, email} = req.body

        db.query("SELECT * FROM Users WHERE email = ?", [email], (err, result) => {
            if (err) {
                console.error("Query Error: ", err);
                return res.status(500).json({message: "Internal Server Error"});
            }
            if(result.length === 0)
                return res.status(404).json({message: "Oops. Some issues occur"})
        });

        if(password.localeCompare(confirmed_password))
            return res.status(402).json({message: "Password does not match!"})

        const {error} = validatePassword({password: password})
        if (error){
            const messages = []
            error.details.forEach((detail) => {
                messages.push(detail.message)
            })
            return res.status(400).json({message: messages})
        }

        const salt = await bcrypt.genSalt(Number(12))
        const hashed = await bcrypt.hash(password, salt)

        db.query("UPDATE Users SET user_password = ? WHERE email = ?", [hashed, email], (err, result) => {
            if (err) {
                console.error("Query Error: ", err);
                return res.status(500).json({message: "Internal Server Error"});
            }
        });
        res.status(201).json({message: "User password updated"})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: "Internal Server Error"})
    }
});

const validatePassword = (data) => {
	const schema = Joi.object({
		password: passwordComplexity().required().label("Password")
	})
	return schema.validate(data)
}

const sendMail = async (receiver) => {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const text = "Your verification code is: " + verificationCode;

    let mailTransporter = nodeMailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        secure: true,
        auth:{
            user: process.env.GMAIL,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    let details = {
        from: `Spartan Market <no-reply.${process.env.GMAIL}>`,
        replyTo: `spartan.market@no-reply.com`,
        to: receiver,
        subject: "Spartan Market Sign Up Verification",
        text: text,
        html: `<p>${text}</p>`
    }

    try {
        await mailTransporter.sendMail(details);
        console.log("Email sent")

        const salt = await bcrypt.genSalt(Number(10))
        const hashed = await bcrypt.hash(verificationCode, salt) 

        return hashed;
    }
    catch(err){
        console.log("send mail error")
        console.log(err);
        return false;
    }
}

module.exports = router;