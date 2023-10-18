const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'cmpe-database.cid1zhaawgw2.us-east-2.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'password',
    database: 'cmpe_272_db'
})

const PORT = 3001;

app.listen(PORT, (err) => {
    if (err)
        console.log("Error, server cannot start", err)
    else
        console.log("Server Connected, and running in PORT: " + PORT)
})

db.connect(function(err) {
    if (err) throw err;
    app.get('/', (req, res) => {
        res.send("Connected to Database.")
    })
});

var sql = "SELECT * FROM Users WHERE user_id = 0";
db.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result[0]);
});

module.exports = db;