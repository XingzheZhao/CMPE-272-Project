const router = require("express").Router();
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");
const nodeMailer = require("nodemailer");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// get all users
router.get("/users", async (req, res) => {
  const db = require("../index").db;

  db.query("SELECT * FROM Users", (err, result) => {
    if (err) {
      console.error("Query Error: ", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else if (result.length === 0) {
      res.status(401).json({ message: "No users" });
    } else {
      const users = result;
      res.status(200).json(users);
    }
  });
});

//create report
router.post("/report", async (req, res) => {
  try {
    const db = require("../index").db;
    const { item_id, initiator_id, report_reason, report_description } =
      req.body;

    const sqlS =
      "INSERT INTO Report (item_id, initiator_id, report_reason, report_description) VALUES (?, ?, ?, ?)";

    db.query(
      sqlS,
      [item_id, initiator_id, report_reason, report_description],
      (err, result) => {
        if (err) {
          console.error("Query Error: ", err);
          res.status(500).json({ message: "Internal Server Error" });
        } else if (result.length === 0) {
          res.status(401).json({ message: "Report not created" });
        } else {
          const report = result;
          res.status(200).json(report);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

// delete a report
router.delete("/report/delete/:id", async (req, res) => {
  try {
    const db = require("../index").db;

    const sqlS = "DELETE FROM Report WHERE report_id = ?";

    db.query(sqlS, req.params.id, (err, result) => {
      if (err) {
        console.error("Query Error: ", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else if (result.length === 0) {
        res.status(401).json({ message: "Record not deleted" });
      } else {
        res.status(200).json("Report Deleted");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// get all reports

router.get("/reports", async (req, res) => {
  const db = require("../index").db;

  db.query("SELECT * FROM Report", (err, result) => {
    if (err) {
      console.error("Query Error: ", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else if (result.length === 0) {
      res.status(401).json({ message: "No Reports" });
    } else {
      const reports = result;
      res.status(200).json(reports);
    }
  });
});

module.exports = router;
