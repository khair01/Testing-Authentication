const express = require('express');
const app = express();
const mongo1 = require('./models/users'); 
const cookieParser = require('cookie-parser');
const colors = require('colors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the directory for view templates
app.set('views', './views');

// Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.json());

app.get('/updates', (req, res) => {
    res.render('main'); // Ensure main.ejs exists in the views directory
});

app.get("/RegisterPage", (req, res) => {
    res.render("RegisterPage");
});

app.post("/register", async (req, res) => {
        let { username, email, password, age } = req.body;


        // Creating user in our database
        let userdata = await mongo1.create({
            username,
            email,
            password,
            age
        });

        res.send(userdata);
});


app.get('/profile', (req, res) => {
    res.send('Server Running.....!');
});

app.get('/', (req, res) => {
    res.render('main');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    await bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return res.status(500).json({ error: 'Error generating salt' });
        }
        bcrypt.hash(password, salt, function (err, hash) {
            if (err) {
                return res.status(500).json({ error: 'Error hashing password' });
            }
            res.json({ username, hash });
        });
    });
    let token = jwt.sign({ username: req.body.username }, "secret");
    res.cookie("token", token);
});

app.get("/read", async (req, res) => {
    let data = await jwt.verify(req.cookies.token, "secret");
    console.log(data);
});

// Adding a new route to check cookie parsing
app.get("/testing", (req, res) => {
    console.log(req.cookies);
    res.send("Testing Complete");
});

let port = 3000; // Changed port to 3001
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
