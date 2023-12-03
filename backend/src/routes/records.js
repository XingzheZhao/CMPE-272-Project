const router = require("express").Router();
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const bcrypt = require("bcrypt");
const nodeMailer = require('nodemailer')
require('dotenv').config()

// get all users
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

// get all records
router.get("/records", async (req, res) => {
    const db = require("../index").db;

    db.query("SELECT * FROM Record", (err, result) => {
        if (err) {
            console.error("Query Error: ", err);
            res.status(500).json({ message: "Internal Server Error" });
        } 
        else if (result.length === 0) {
            res.status(401).json({ message: "No records" });
        }
        else{
            const records = result;
            res.status(200).json(records);
        } 
    });
    
});

// create a record
router.post("/create", async (req, res) => {
    try {
        const db = require("../index").db;
        const {buyer_id, seller_id, item_id, is_item} = req.body;

        const sqlS = "INSERT INTO Record (buyer_id, seller_id, item_id, is_item) VALUES (?, ?, ?, ?)";

        db.query(sqlS, [buyer_id, seller_id, item_id, is_item] ,(err, result) => {
            if (err) {
                console.error("Query Error: ", err);
                res.status(500).json({ message: "Internal Server Error" });
            } 
            else if (result.length === 0) {
                res.status(401).json({ message: "Record not created" });
            }
            else{
                const record = result;
                res.status(200).json(record);
            } 
        })
    } catch (err) {
        console.log(err)
    }
});

// delete a record
router.delete("/delete/:id", async (req, res) => {
    try {
        const db = require("../index").db;

        const sqlS = "DELETE FROM Record WHERE record_id = ?";

        db.query(sqlS, req.params.id ,(err, result) => {
            if (err) {
                console.error("Query Error: ", err);
                res.status(500).json({ message: "Internal Server Error" });
            } 
            else if (result.length === 0) {
                res.status(401).json({ message: "Record not deleted" });
            }
            else{
                res.status(200).json("Record Deleted");
            } 
        })
    } catch (err) {
        console.log(err)
    }
});

//create report
router.post("/report", async (req, res) => {
    try {
        const db = require("../index").db;
        const {record_id, initiator_id, report_reason, report_description} = req.body;

        const sqlS = "INSERT INTO Report (record_id, initiator_id, report_reason, report_description) VALUES (?, ?, ?, ?)";

        db.query(sqlS, [record_id, initiator_id, report_reason, report_description] ,(err, result) => {
            if (err) {
                console.error("Query Error: ", err);
                res.status(500).json({ message: "Internal Server Error" });
            } 
            else if (result.length === 0) {
                res.status(401).json({ message: "Report not created" });
            }
            else{
                const report = result;
                res.status(200).json(report);
            } 
        })
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;