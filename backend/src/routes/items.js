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

module.exports = router;