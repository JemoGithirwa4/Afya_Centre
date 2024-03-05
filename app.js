const express = require("express");
const request = require("request");
const session = require("express-session");
const http = require("http");
const bodyParser = require('body-parser');
const mysql = require('mysql2');
var regExpression = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+/;
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname+"/public")));
app.use(bodyParser.urlencoded({ extended: true }));

io.on("connection", function(socket){
    socket.on("newuser", function(username){
        socket.broadcast.emit("update", username + " joined the conversation");
    });

    socket.on("exituser", function(username){
        socket.broadcast.emit("update", username + " left the conversation");
    });

    socket.on("chat", function(message){
        socket.broadcast.emit("chat", message);
    });
});

// Database configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@Kukurella17',
    database: 'afya_centre',
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/login.html");
});

app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
  });

app.get('/get-plan', (req, res) => {
    const plan = req.query.plan;

    if (plan) {
        // You can create a mapping from plan names to page paths
        const planPages = {
            'children': '/children.html',
            'lactating': '/lactating-plan.html',
            'muscle-gain': '/muscle-gain-plan.html',
            'keto': '/keto-plan.html',
            'carnivore': '/carnivore-plan.html',
            'strength': '/strength.html',
            'homeworkout': '/homeworkout.html',
            'cardiovascular': '/cardiovascular.html',
            'hiit': '/hiit.html',
            'read': '/Readbook.html'
        };

        const pagePath = planPages[plan];

        if (pagePath) {
            res.sendFile(__dirname + pagePath);
        } else {
            // Handle invalid plan
            res.status(404).send('Invalid plan');
        }
    } else {
        // Handle missing plan parameter
        res.status(400).send('Plan parameter missing');
    }
});

// Route to handle signup form submission
app.post('/signup', (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validate the form data 
    if (!firstName || !lastName || !email || !password || password !== confirmPassword || !regExpression.test(email)) {
        return res.status(400).send('Invalid input data');
    }
    // Check if the email already exists in the database
    const checkEmailQuery = 'SELECT * FROM users WHERE Email = ?';
    db.query(checkEmailQuery, [email], (checkErr, checkResults) => {
        if (checkErr) {
            console.error('Error checking email existence:', checkErr);
            return res.status(500).sendFile(__dirname + "/failurecompletely.html");
        }

        // If the email already exists
        if (checkResults.length > 0) {
            return res.status(400).sendFile(__dirname + "/failure.html");
        }

        // If the email is not in use, proceed with the signup
        const insertUserQuery = 'INSERT INTO users (First_name, Last_name, Email, Password) VALUES (?, ?, ?, ?)';
        db.query(insertUserQuery, [firstName, lastName, email, password], (insertErr, insertResult) => {
            if (insertErr) {
                console.error('Error executing query:', insertErr);
                return res.status(500).sendFile(__dirname + "/failurecompletely.html");
            }

            res.sendFile(__dirname + "/index.html");
        });
    });
});

// ...

// Route to handle login form submission
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validate the login credentials
    if (!email || !password) {
        return res.status(400).sendFile(__dirname + "/loginfail.html");
    }

    // Check if the email and password match a user in the database
    const checkLoginQuery = 'SELECT * FROM users WHERE BINARY Email = ? AND BINARY Password = ?';
    db.query(checkLoginQuery, [email, password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).sendFile(__dirname + "/failurecompletely.html");
        }

        // If there is a matching user, redirect to the homepage
        if (results.length > 0) {
            res.sendFile(__dirname + "/index.html");
        } else {
            // If no matching user, respond with an error message
            res.status(401).sendFile(__dirname + "/loginfail.html");
        }
    });
});

app.post('/support', (req, res) => {
    const { name, email, issue} = req.body;

    if (!name || !email || !issue) {
        return res.status(400).sendFile(__dirname + "/loginfail.html");
    }

    // Insert data into the database
    const insertSupportQuery = 'INSERT INTO support (User_name, email, issue) VALUES (?, ?, ?)';
    db.query(insertSupportQuery, [name, email, issue], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error inserting data into the database');
        }

        // Successful insertion
        return res.status(200).sendFile(__dirname + "/success-support.html");
    });
});

// Route to handle meal plan selection
app.post('/select-plan', (req, res) => {
    const { planId } = req.body;

    
    const userEmail = req.session.userEmail;

    if (!userEmail) {
        return res.status(401).send('User not logged in');
    }

    // Insert the selected meal plan into the user_meal_plan table
    const insertUserMealPlanQuery = 'INSERT INTO user_meal_plan (meal_plan_ID, email) VALUES (?, ?)';
    db.query(insertUserMealPlanQuery, [planId, userEmail], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error selecting meal plan');
        }

        return res.status(200).send('Meal plan selected successfully!');
    });
});



app.listen(3000, function() {
    console.log("Server is running on port 3000")
});