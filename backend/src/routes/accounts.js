const router = require("express").Router();
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");
const nodeMailer = require("nodemailer");
require("dotenv").config();
const db = require("../../config/db");

var saltRounds = 10;

router.post("/login", async (req, res) => {
  const db = require("../index").db;
  const username = req.body.username;
  const password = req.body.password;
  db.query(
    "SELECT user_id, username, user_password, is_admin FROM Users WHERE username = ?",
    [username],
    async (err, result) => {
      if (err) {
        console.error("Query Error: ", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else if (result.length === 0) {
        res.status(401).json({ message: "User does not exist" });
      } else {
        const hashedPassword = result[0].user_password;
        const samePassword = await bcrypt.compare(password, hashedPassword);
        if (samePassword) {
          console.log("Login Successful");
          res.status(200).json(result);
        } else {
          console.log("Password Incorrect");
          res.status(401).json({ message: "Password Incorrect" });
        }
      }
    }
  );
});

router.post("/register", async (req, res) => {
  try {
    const { username, email } = req.body;

    await db.query(
      "SELECT * FROM Users WHERE username = ? OR email = ?",
      [username, email],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Internal Server Error" });
        } else if (result.length !== 0) {
          return res.status(401).json({ message: "User Exists" });
        }
      }
    );

    const result = await sendMail(email);

    if (result === false) {
      res.status(410).json({ message: "Email cannot send" });
    } else {
      res.status(202).json({ message: "Email sent", code: result });
    }
  } catch (error) {
    console.error("Error registering user", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/register/auth", async (req, res) => {
  try {
    const db = require("../index").db;
    const { data, code, hashed_code } = req.body;
    const isAdmin = false;

    const valid = await bcrypt.compare(code, hashed_code);
    if (!valid) return res.status(401).json({ message: "Invalid code" });

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(data.userPassword, salt);

    await db.query(
      "INSERT INTO Users (username, user_password, f_name, l_name, email, phone_num, is_admin) VALUES (?, ?, ?, ?, ?, ?, ?);",
      [
        data.username,
        hashedPassword,
        data.firstName,
        data.lastName,
        data.email,
        data.phoneNumber,
        isAdmin,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Internal Server Error" });
        } else {
          res.status(200).json(result);
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Erorr" });
  }
});

router.post("/forget-password", async (req, res) => {
  try {
    const db = require("../index").db;
    const { email, username } = req.body;

    db.query(
      "SELECT * FROM Users WHERE username = ? AND email = ?",
      [username, email],
      (err, result) => {
        if (err) {
          console.error("Query Error: ", err);
          return res.status(500).json({ message: "Internal Server Error" });
        } else if (result.length === 0) {
          return res
            .status(401)
            .json({ message: "Username/Email does not exist" });
        }
      }
    );

    const result = await sendMail(email);

    if (result === false) {
      res.status(410).json({ message: "Email cannot send" });
    } else {
      res
        .status(202)
        .json({ message: "Email sent", data: email, code: result });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/send-email", async (req, res) => {
  const email = req.body.email;
  const result = await sendMail(email);

  if (result === false) {
    res.status(500).json("Internal Server Error");
  } else {
    res.status(202).json({ message: "Email sent", code: result });
  }
});

router.post("/auth", async (req, res) => {
  try {
    const { code, hashed_code } = req.body;

    const valid = await bcrypt.compare(code, hashed_code);
    if (!valid) return res.status(401).json({ message: "Invalid code" });
    else return res.status(200).json({ message: "valid code" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const db = require("../index").db;
    const { password, confirmed_password, email } = req.body;

    db.query("SELECT * FROM Users WHERE email = ?", [email], (err, result) => {
      if (err) {
        console.error("Query Error: ", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      if (result.length === 0)
        return res.status(404).json({ message: "Oops. Some issues occur" });
    });

    if (password.localeCompare(confirmed_password))
      return res.status(402).json({ message: "Password does not match!" });

    const { error } = validatePassword({ password: password });
    if (error) {
      const messages = [];
      error.details.forEach((detail) => {
        messages.push(detail.message);
      });
      return res.status(400).json({ message: messages });
    }

    const salt = await bcrypt.genSalt(Number(12));
    const hashed = await bcrypt.hash(password, salt);

    db.query(
      "UPDATE Users SET user_password = ? WHERE email = ?",
      [hashed, email],
      (err, result) => {
        if (err) {
          console.error("Query Error: ", err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
      }
    );
    res.status(201).json({ message: "User password updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const validatePassword = (data) => {
  const schema = Joi.object({
    password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(data);
};

const sendMail = async (receiver) => {
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const text = "Your verification code is: " + verificationCode;

  let mailTransporter = nodeMailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: true,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  let details = {
    from: `Spartan Market <no-reply.${process.env.GMAIL}>`,
    replyTo: `spartan.market@no-reply.com`,
    to: receiver,
    subject: "Spartan Market Sign Up Verification",
    text: text,
    html: `<p>${text}</p>`,
  };

  try {
    await mailTransporter.sendMail(details);
    console.log("Email sent");

    const salt = await bcrypt.genSalt(Number(10));
    const hashed = await bcrypt.hash(verificationCode, salt);

    return hashed;
  } catch (err) {
    console.log("send mail error");
    console.log(err);
    return false;
  }
};

// const validationCookie = (req, res, next) => {
//   const username = req.cookies.username;
//   if (!username) {
//     return res.status(401).json({ message: "User Not Authenticated" });
//   } else {
//     req.user = username;
//     return next();
//   }
// };

// convert datetime format
function formatDateTime(inputDateTime) {
  // Parse the input datetime string
  const dateTime = new Date(inputDateTime);

  // Get the individual components of the date and time
  const year = dateTime.getFullYear();
  const month = String(dateTime.getMonth() + 1).padStart(2, "0");
  const day = String(dateTime.getDate()).padStart(2, "0");
  const hours = String(dateTime.getHours()).padStart(2, "0");
  const minutes = String(dateTime.getMinutes()).padStart(2, "0");
  const seconds = String(dateTime.getSeconds()).padStart(2, "0");

  // Format the date and time according to your desired output
  const formattedDateTime = `${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
}

router.get("/profile", async (req, res, next) => {
  try {
    // Access the cookies from the request object
    const username = req.cookies.username;
    const userId = req.cookies.id;
    const role = req.cookies.role;

    // validate cookie
    if (!username) {
      return res.status(401).json({ message: "User Not Authenticated!" });
    }

    // get user info
    const [userProfile] = await db.query(
      "SELECT username, f_name, l_name, email, phone_num FROM Users WHERE user_id=?;",
      [userId]
    );
    // selling item
    const [sellingItem] = await db.query(
      "SELECT item_name, item_type, item_price, is_exchange, exchange_demand, post_datetime, item_description, item_id FROM Item WHERE seller_id=? AND item_status!='sold';",
      [userId]
    );

    // buying item
    const [buyingItem] = await db.query(
      "SELECT item_name, item_type, item_price, is_exchange, exchange_demand, post_datetime, item_description, item_id FROM Item WHERE buyer_id=? AND item_status!='sold';",
      [userId]
    );

    // history
    const [soldHistory] = await db.query(
      "SELECT item_name, item_type, item_price, is_exchange, exchange_demand, post_datetime, item_description FROM Item WHERE seller_id=? AND item_status='sold';",
      [userId]
    );

    const [boughtHistory] = await db.query(
      "SELECT item_name, item_type, item_price, is_exchange, exchange_demand, post_datetime, item_description FROM Item WHERE buyer_id=? AND item_status='sold';",
      [userId]
    );

    sellingItem.forEach((row) => {
      row.post_datetime = formatDateTime(row.post_datetime);
    });

    buyingItem.forEach((row) => {
      row.post_datetime = formatDateTime(row.post_datetime);
    });

    boughtHistory.forEach((row) => {
      row.post_datetime = formatDateTime(row.post_datetime);
    });

    soldHistory.forEach((row) => {
      row.post_datetime = formatDateTime(row.post_datetime);
    });
    res.status(200).json({
      userProfile: userProfile,
      sellingItem: sellingItem,
      buyingItem: buyingItem,
      soldHistory: soldHistory,
      boughtHistory: boughtHistory,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// ! admin section
// ! admin view
router.get("/admin", async (req, res, next) => {
  try {
    const username = req.cookies.username;
    const userId = req.cookies.id;
    const role = req.cookies.role;
    // check cookie for admin
    if (!username || role !== "admin") {
      return res.status(401).json({ message: "Admin Not Authenticated!" });
    }

    // get recent history
    const [completedSell] = await db.query(
      "SELECT i.item_name, i.item_type, i.item_price, seller.username AS seller_username, buyer.username AS buyer_username, i.post_datetime FROM Item i LEFT JOIN Users seller ON i.seller_id=seller.user_id LEFT JOIN Users buyer ON i.buyer_id=buyer.user_id WHERE i.item_Status='sold';"
    );

    // get reports
    const [reports] = await db.query(
      "SELECT initiator.username AS initiator_username, r.report_reason, r.report_description, r.item_id, i.item_name, r.is_solved, r.report_id FROM Report r INNER JOIN Users initiator ON r.initiator_id=initiator.user_id LEFT JOIN Item i ON r.item_id=i.item_id WHERE r.is_solved=0;"
    );

    res.status(200).json({ completedSell: completedSell, report: reports });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// ! admin cookie check
const authenticateAdmin = (req, res, next) => {
  const username = req.cookies.username;
  const userId = req.cookies.id;
  const role = req.cookies.role;
  // check cookie for admin
  if (!username || role !== "admin") {
    return res.status(401).json({ message: "Admin Not Authenticated!" });
  } else {
    return next();
  }
};

// ! admin solve report
router.put("/reports/:report_id/solve", authenticateAdmin, async (req, res) => {
  const { report_id } = req.params;

  try {
    const query = "UPDATE Report SET is_solved=1 WHERE report_id=?;";
    await db.query(query, [report_id]);

    res.status(200).json({ message: "Report is marked as solved." });
  } catch (error) {
    console.error("Error updating report: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ! admin view all users
router.get("/admin/view-users", authenticateAdmin, async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT user_id, username, f_name, l_name, email, phone_num FROM Users"
    );

    res.status(200).json({ users: users });
  } catch (error) {
    console.log("Error retrieving user data: ", error);
    res.status;
  }
});

// ! admin remove user
router.delete("/admin/user/:userId", authenticateAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;

    const query = "DELETE FROM Users WHERE user_id=?;";
    await db.query(query, [userId]);
    res.status(200).json({ message: "User has been removed!" });
  } catch (error) {
    console.error("Error removing user: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
