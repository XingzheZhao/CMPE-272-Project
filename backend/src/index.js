const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const accounts = require('./routes/accounts')

const app = express();

app.use(express.json());
app.use(cors());
app.use("/accounts", accounts)

const db = mysql.createConnection({
    host: 'cmpe-database.cid1zhaawgw2.us-east-2.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'password',
    database: 'cmpe_272_db'
})

db.connect(function(err) {
    if (err) throw err;
    app.get('/', (req, res) => {
        res.send("Connected to Database.");
    })
    console.log("Connected to Database");
});

const PORT = 3001;

app.listen(PORT, (err) => {
    if (err)
        console.log("Error, server cannot start", err)
    else
        console.log("Server Connected, and running in PORT: " + PORT)
})

module.exports = { app, db };