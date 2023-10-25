const router = require("express").Router();
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const bcrypt = require("bcrypt");
const sgMail = require('@sendgrid/mail')

router.post("/forget-password", async(req, res) => {
    try{
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
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
            else { 
                const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
                const text = "Your verification code is: " + verificationCode;
                const msg = {
                    to: 'peizuli1@gmail.com',
                    from: 'peizu.li@sjsu.edu',
                    subject: 'Spartan Market Verification',
                    text: text,
                }
                sgMail
                    .send(msg)
                    .then((response) => {
                        console.log(response[0])
                    })
                    .catch((error) => {
                        console.error(error)
                        res.status(410).json({ message: "Email cannot send" });
                    })
                res.status(201).json({ message: "Found a valid user", data: username, code: verificationCode });
            }
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})
    }
});

router.post("/reset-password", async(req, res) => {
    try{
        const {password, confirmed_password, username} = req.body

        db.query("SELECT * FROM Users WHERE username = ?", [username], (err, result) => {
            if (err) {
                console.error("Query Error: ", err);
                return res.status(500).json({message: "Internal Server Error"});
            }
            if(result.length === 0)
                return res.status(404).json({message: "Oops. Some issues occur"})
        });

        if(password.localeCompare(confirmed_password))
            return res.status(402).json({message: "Password does not match!"})

        const {error} = validatePassword(password)
        if (error){
            const messages = []
            error.details.forEach((detail) => {
                messages.push(detail.message)
            })
            return res.status(400).json({message: messages})
        }

        const salt = await bcrypt.genSalt(Number(12))
        const hashed = await bcrypt.hash(password, salt)

        db.query("UPDATE Users SET user_password = ? WHERE username = ?", [hashed, username], (err, result) => {
            if (err) {
                console.error("Query Error: ", err);
                return res.status(500).json({message: "Internal Server Error"});
            }
        });
        res.status(201).json({message: "User password updated"})
    }
    catch(err){
        res.status.json({message: "Internal Server Error"})
    }
});

const validatePassword = (data) => {
	const schema = Joi.object({
		password: passwordComplexity().required().label("Password")
	})
	return schema.validate(data)
}

module.exports = router;