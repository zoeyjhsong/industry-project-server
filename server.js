const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "signup",
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database: ", err);
        return;
    }
    console.log("Connected to database");
});

app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;
    
    const sqlInsert = "INSERT INTO login (name, email, password) VALUES (?, ?, ?)";
    
    db.query(sqlInsert, [name, email, password], (err, results) => {
        if (err) {
            console.error("Failed to insert new user: ", err);
            return res.status(500).json({ message: "Failed to register user", error: err });
        }
        
        res.status(201).json({ message: "User registered successfully", userId: results.insertId });
    });
});
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    
    const sqlInsert = "SELECT * FROM login WHERE `email`= ? AND `password`= ? ";
    
    db.query(sqlInsert, [ email, password], (err, results) => {
        console.log(results);
        if (err) {
            console.error("Failed to find user: ", err);
            return res.status(500).json({ message: "Failed to find user", error: err });
        }
        if (results.length > 0) {
            // return res.json(results);
            const user = results[0]
            var token = jwt.sign({user: user }, 'shhhhh');
            console.log(token);
            return res.json({token: token});
            }
        
        else {
            return res.status(404).json({ message: "User not found" });
        }
        
    });
});

function authorize(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, 'shhhhh', (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        next();
    });
}
app.get("/home",authorize, (req, res) => {
    const id = req.user.user.id;
    console.log(id);
    return res.json(req.user);
})

app.post("/reserve-seat", authorize, (req, res) => {
    const { seat_id } = req.body;
    const user_id = req.user.user.id; // Extracted from the JWT token

    const sqlInsert = "INSERT INTO reserved_seats (seat_id, user_id) VALUES (?, ?)";

    db.query(sqlInsert, [seat_id, user_id], (err, results) => {
        if (err) {
            console.error("Failed to reserve seat: ", err);
            return res.status(500).json({ message: "Failed to reserve seat", error: err });
        }

        res.status(201).json({ message: "Seat reserved successfully" });
    });
});



app.listen(3001, () => {
    console.log("Server started on port 3001");
});
