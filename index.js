const express = require('express'),
      app = express(),
      port = 3000,
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      db = require('./models'),
      session = require("express-session"),
      store = new session.MemoryStore(),
      bcrypt = require('bcrypt'),
      flash = require('express-flash'),
      isAuthenticated = require('./utils/isAuthenticated.js'),
      loginRouter = require('./routes/login.js'),
      createAccountRouter = require('./routes/createAccount.js'),
      usersRouter = require('./routes/users.js'),
      productsRouter = require('./routes/products.js'),
      cartRouter = require('./routes/cart.js');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());


app.use(session({
    secret: "test",
    cookie: { maxAge: 300000000, secure: false },
    saveUninitialized: false,
    resave: false,
    store
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async (username, password, done) => {
    try{
        console.log('Login attempt with username:', username);
        const user = await db.User.findOne({ where: {username } });

        if (!user) {
            console.log('User not found');
            return done(null, false, { message: 'User not found' });
        }
        const matchedPassword = await bcrypt.compare(password, user.password);
        if (!matchedPassword) {
            console.log('Incorrect password');
            return done(null, false, { message: 'Incorrect username or password' });
        }
        console.log('Authentication successful');
        return done(null, user);
    } catch (err) {
        console.error('Error during authentication:', err);
        return done(err);
    }
}));

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    db.User.findByPk(id).then(user => {
        cb(null, user);
    }).catch(err => cb(err));
});

app.use('/login', loginRouter);
app.use('/createAccount', createAccountRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter)
app.use('/cart', cartRouter);

app.get('/', (req, res) => {
    res.render('landingPage');
});

app.get('/logout', isAuthenticated, (req, res) => {
    req.logout();
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/');
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('An error was encountered');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});