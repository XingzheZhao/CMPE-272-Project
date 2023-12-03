const router = require('express').Router();
require('dotenv').config();

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
        const buyer = req.query.buyer;
        let sql = 'SELECT item_id, item_name, item_price, is_exchange, item_image, post_datetime FROM Item WHERE item_status = "progress" AND buyer_id = ?';

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

})

module.exports = router;