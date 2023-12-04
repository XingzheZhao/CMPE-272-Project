const router = require('express').Router();
const multer = require('multer');
const nodeMailer = require('nodemailer');
require('dotenv').config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/on-sale-items", async (req, res) => {
    try{
        const db = require('../index').db
        let sql = 'SELECT item_id, item_name, item_price, is_exchange, item_image, post_datetime FROM Item WHERE item_status = "on sale"';

        db.query(sql, (error, result) => {
            if(error){
                console.log(error);
                res.status(400).json("Failed to fetch items");
            }
            else{
                res.status(200).json(result);
            }
        })
    }
    catch (err){
        console.log(err);
        res.status(500).json("Internal Server Error");
    }
})

router.get("/in-progress-items", async (req, res) => {
    try{
        const db = require('../index').db
        const user = req.query.user;
        let sql = 'SELECT item_id, item_name, item_price, is_exchange, item_image, post_datetime FROM Item WHERE item_status = "progress" AND (buyer_id = ? OR seller_id = ?)';

        db.query(sql, [user, user], (error, result) => {
            if(error){
                console.log(error);
                res.status(400).json("Failed to fetch items");
            }
            else{
                res.status(200).json(result);
            }
        })
    }
    catch (err){
        console.log(err);
        res.status(500).json("Internal Server Error");
    }
})

router.get("/search-on-sale", async (req, res) => {
    try{
        const db = require('../index').db
        const search = req.query.search;
        let sql = `SELECT item_id, item_name, item_price, is_exchange, item_image, post_datetime FROM Item WHERE item_status = "on sale" AND item_name LIKE "%${search}%"`;

        db.query(sql, (error, result) => {
            if(error){
                console.log(error);
                res.status(400).json("Failed to fetch items");
            }
            else{
                res.status(200).json(result);
            }
        })
    }
    catch (err){
        console.log(err);
        res.status(500).json("Internal Server Error");
    }
})

router.get("/search-in-progress", async (req, res) => {
    try{
        const db = require('../index').db
        const search = req.query.search;
        const buyer = req.query.buyer;
        let sql = `SELECT item_id, item_name, item_price, is_exchange, item_image, post_datetime FROM Item WHERE item_status = "progress" AND buyer_id = ? AND item_name LIKE "%${search}%"`;

        db.query(sql, [buyer], (error, result) => {
            if(error){
                console.log(error);
                res.status(400).json("Failed to fetch items");
            }
            else{
                res.status(200).json(result);
            }
        })
    }
    catch (err){
        console.log(err);
        res.status(500).json("Internal Server Error");
    }
})

router.get("/item", async (req, res) => {
    try{
        const db = require('../index').db;
        const id = req.query.id;

        let sql = "SELECT I.item_name, I.item_type, I.item_price, I.is_exchange, I.exchange_demand, I.item_image, I.post_datetime, I.item_description, U.username, U.email FROM Item I, Users U WHERE U.user_id = I.seller_id AND I.item_id = ?";

        db.query(sql, [id], (error, result) => {
            if(error){
                console.log(error);
                res.status(400).json("Failed to fetch item")
            }
            else{
                res.status(200).json(result);
            }
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json("Internal Server Error")
    }
})

router.delete("/item", async (req, res) => {
    try{
        const db = require('../index').db;
        const id = req.query.id;

        const sql = `DELETE FROM Item WHERE item_id = ${id}`

        db.query(sql, (error, result) => {
            if(error){
                console.log(error);
                res.status(400).json("Failed to delete item");
            }
            else{
                res.status(200).json(result)
            }
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json("Internal Server Error")
    }
})

router.post("/interested-item", async (req, res) => {
    try{
        const db = require('../index').db;
        const {seller, seller_email, buyer, item, id, item_id} = req.body;

        let sql = "SELECT email FROM Users WHERE username = ?";
        db.query(sql, [buyer], async (err, result) => {
            if(err){
                return res.status(500).json("Internal Server Eror")
            }
            const buyer_email = result[0].email;
            
            const mail_result = await sendMail(seller, seller_email, item, buyer, buyer_email);
            if(!mail_result){
                return res.status(401).json("Email Error");
            }
        });
        
        sql = "UPDATE Item SET item_status = ?, buyer_id = ? WHERE item_id = ?";
        db.query(sql, ["progress", id, item_id], (err, result) => {
            if(err){
                return res.status(500).json("Internal Server Eror");
            }
            else{
                res.status(200).json(result);
            }
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json("Internal Server Error");
    }
})

router.post("/item/edit", upload.single('item_image'), async (req, res) => {
    try{
        const db = require('../index').db;
        const { id, item_name, item_description, is_exchange, item_price, exchange_demand, item_type } = req.body;
        const item_image = req.file.buffer;
            
        const sql = "UPDATE Item SET item_name = ?, item_type = ?, item_description = ?, item_image = ?, is_exchange = ?, item_price = ?, exchange_demand = ? WHERE item_id = ?";
        db.query(sql, [item_name, item_type, item_description, item_image, is_exchange, item_price, exchange_demand, id], (err, result) => {
            if(err){
                console.log(err);
                res.status(401).json({message: "Update Item Error"})
            }
            else{
                console.log(result)
                res.status(200).json(result)
            }
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json("Internal Server Error")
    }
});

router.post("/item/edit-null-image", upload.single('item_image'), async (req, res) => {
    try {
        const db = require('../index').db;
        const { id, item_name, item_description, is_exchange, item_price, item_type } = req.body;
        let { exchange_demand } = req.body;

        if (exchange_demand === "null") {
            exchange_demand = null;
        }

        const sql = "UPDATE Item SET item_name = ?, item_type = ?, item_description = ?, item_image = NULL, is_exchange = ?, item_price = ?, exchange_demand = ? WHERE item_id = ?";
        
        db.query(sql, [item_name, item_type, item_description, is_exchange, item_price, exchange_demand, id], (err, result) => {
            if (err) {
                console.log(err);
                res.status(401).json({ message: "Update Item Error" });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal Server Error");
    }
});

router.post("/item/edit-no-image", upload.single('item_image'), async (req, res) => {
    try {
        const db = require('../index').db;
        const { id, item_name, item_description, is_exchange, item_price, item_type } = req.body;
        let { exchange_demand } = req.body;

        if (exchange_demand === "null") {
            exchange_demand = null;
        }

        const sql = "UPDATE Item SET item_name = ?, item_type = ?, item_description = ?, is_exchange = ?, item_price = ?, exchange_demand = ? WHERE item_id = ?";
        
        db.query(sql, [item_name, item_type, item_description, is_exchange, item_price, exchange_demand, id], (err, result) => {
            if (err) {
                console.log(err);
                res.status(401).json({ message: "Update Item Error" });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal Server Error");
    }
});

router.post("/not-interest", async (req, res) => {
    try{
        const db = require("../index").db;
        const {item_id} = req.body;
        
        const sql = "UPDATE Item SET item_status = ?, buyer_id = NULL WHERE item_id = ?";
        db.query(sql, ["on sale", item_id], (err, result) => {
            if(err){
                console.log(err);
                res.status(401).json("Update Eror");
            }
            else{
                res.status(200).json(result);
            }
        })
    }
    catch (err){
        console.log(err);
        res.status(500).json("Internal Server Error")
    }
})

router.post("/transcation-complete", async (req, res) => {
    try{
        const db = require("../index").db;
        const {item_id} = req.body;
        
        const sql = "UPDATE Item SET item_status = ? WHERE item_id = ?";
        db.query(sql, ["sold", item_id], (err, result) => {
            if(err){
                console.log(err);
                res.status(401).json("Update Eror");
            }
            else{
                res.status(200).json(result);
            }
        })
    }
    catch (err){
        console.log(err);
        res.status(500).json("Internal Server Error")
    }
});

router.post("/item/create-null-image", upload.single('item_image'), async (req, res) => {
    const db = require("../index").db;

    const { id, item_name, item_description, item_price, item_type, is_exchange } = req.body;
    let { exchange_demand } = req.body;
    if(exchange_demand === "null"){
        exchange_demand = null;
    }

    console.log(id, item_name, item_description, item_price, item_type, is_exchange, exchange_demand)
    const sql = "INSERT INTO Item (seller_id, item_name, item_type, item_price, is_exchange, exchange_demand, item_image, item_status, post_datetime, item_description) VALUES (?, ?, ?, ?, ?, ?, NULL, ?, NOW(), ?)"
    
    db.query(sql, [id, item_name, item_type, item_price, is_exchange, exchange_demand, "on sale", item_description], (err, result) => {
        if(err){
            console.log(err);
            res.status(500).json("Internal Server Error");
        }
        else{
            res.status(200).json(result);
        }
    })
})

router.post("/item/create", upload.single('item_image'), async (req, res) => {
    try{
        const db = require('../index').db;
        const { id, item_name, item_description, item_price, item_type, is_exchange } = req.body;
        let { exchange_demand } = req.body;
        if(exchange_demand === "null"){
            exchange_demand = null;
        }
        const item_image = req.file.buffer;
            
        const sql = "INSERT INTO Item (seller_id, item_name, item_type, item_price, is_exchange, exchange_demand, item_image, item_status, post_datetime, item_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)"
        db.query(sql, [id, item_name, item_type, item_price, is_exchange, exchange_demand, item_image, "on sale", item_description], (err, result) => {
            if(err){
                console.log(err);
                res.status(500).json("Internal Server Error");
            }
            else{
                console.log(result)
                res.status(200).json(result)
            }
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json("Internal Server Error")
    }
});

const sendMail = async (seller, seller_email, item, buyer, buyer_email) => {
    const text = buyer + " is interested on your item: " + item;
    
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
        to: seller_email,
        subject: "A Buyer is Interested on Your Item",
        text: text,
        html: `<p><strong>${buyer}</strong> is interested on your item: <b>${item}</b>.</p> <p>Contact <b>${buyer_email}</b> for detailed transcation.</p>`
    }

    try{
        await mailTransporter.sendMail(details);
        console.log("email sent");
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

module.exports = router;