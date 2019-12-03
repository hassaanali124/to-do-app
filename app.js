const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const methodOverride = require("method-override");
const session = require('express-session')
const nodemailer = require('nodemailer')

const cookieParser = require('cookie-parser')
const LocalStrategy = require('passport-local').Strategy;
const User = require("./models/User")
const Contacts = require("./models/contacts");

const port = 3000
const app = express()


let transporter = nodemailer.createTransport({
    pool: true,
    service: "Gmail",
    secure: false, // use SSL
    auth: {
        user: "hassaanaliips@gmail.com",
        pass: "skhassaanalisk"
    },
    tls: {
        rejectUnauthorized: false
    }
});


mongoose.connect("mongodb://localhost:27017/to-do-list", (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("DB connected")
    }
})

app.use(express.static('public'))
app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')


app.use(session({
    secret: 'hassaanali',
    resave: false,
    saveUninitialized: false,
}))

//bcrypt - hashing the pwd

//init passport

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByEmail(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown User' })
            }
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user)
                } else {
                    return done(null, false, { message: 'Invalid password' })
                }
            })
        })
    }
))

passport.serializeUser(function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user)
    })
})

app.get('/', (req, res) => {
    res.render('login')
})
app.get('/index', (req, res) => {
    Contacts.find()
        .then(data => {
            res.render('index', { data })
        })
        .catch(err => {
            console.log(err)
            res.redirect("/")
        })
})
app.get('/update', (req, res) => {
    res.render('update')
})




app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/index')
    })

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    const password = req.body.password
    const password2 = req.body.password2
    if (password === password2) {
        var newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        User.createUser(newUser, async function (err, user) {
            if (err) {
                console.log(err)
            } else {

                var mailOptions = {
                    from: "Images App <hassaanaliips@gmail.com>", //sender address
                    to: user.email,       //list of receivers
                    subject: `Thank you for registering`,
                    html: `<p>Hi ${user.name}</p>
                    <p>Thank you for registering</p>
                    <p>Regards</p>
                    <p>Team Images App </p>`
                } //dend email with defined transport object
                await transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(info)
                    }
                })
                console.log('user created')
                res.redirect("/login")
            }
        })
    } else {
        console.log("password doesnt match")
    }
})

app.get('/index', isLoggedin, (req, res) => {
    //console.log(req.session)
    res.render('index')
})

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login')
})



function isLoggedin(req, res, next) {
    console.log(req.user)
    if (req.user) {
        return next();
    }
    res.redirect('/login')
}

app.listen(port, () => {
    console.log(`Listening at port ${port}`)
})