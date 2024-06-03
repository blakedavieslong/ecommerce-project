const express = require('express'),
      app = express(),
      port = 3000,
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      db = require('./models'),
      session = require("express-session"),
      store = new session.MemoryStore();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(session({
    secret: "test",
    cookie: { maxAge: 300000000, secure: false },
    saveUninitialized: false,
    resave: false,
    store,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(function (username, password, cb) {
    console.log('Login attempt with username:', username);
    db.users.findOne({ where: {username } }).then(user => {
        if (!user) {
            console.log('User not found');
            return cb(null, false);
        }
        if (user.password != password) {
            console.log('Incorrect password');
            return cb(null, false);
        }
        console.log('Authentication successful');
        return cb(null, user);
    }).catch(err => {console.error('Error during authentication:', err); cb(err)});
}));

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    db.users.findByPk(id).then(user => {
        cb(null, user);
    }).catch(err => cb(err));
});

app.get('/login', function(req, res, next) {
    res.render('login');
});

app.post('/login', 
    passport.authenticate("local", { successRedirect: '/' , failureRedirect: "/login" }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})