const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./db/spartan_market.db', sqlite3.OPEN_READWRITE, (err) => {
    if(err){
        console.log(err)
        console.log('Connection Failed!')
        throw err;
    }
    else{
        console.log('Database connected!')
    }
})

const PORT = 3001;

app.listen(PORT, (err) => {
    if (err)
        console.log("Error, server cannot start", err)
    else
        console.log("Server Connected, and running in PORT: " + PORT)
})

module.exports = db;