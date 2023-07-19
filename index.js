/* INITIAL SETUP */
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

/* USING DEPENDENCIES */
const app = express();
app.use("/static",express.static(__dirname + "/public"));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

/* HANDLEBARS */
const hbs = exphbs.create({
    extname: 'hbs',
    helpers: {
        when: function (operand_1, operator, operand_2, options) {
            let operators = {
            'eq': (l, r) => l == r,
            'noteq': (l, r) => l != r,
            'gt': (l, r) => (+l) > (+r),
            'gteq': (l, r) => ((+l) > (+r)) || (l == r),
            'lt': (l, r) => (+l) < (+r),
            'lteq': (l, r) => ((+l) < (+r)) || (l == r),
            'or': (l, r) => l || r,
            'and': (l, r) => l && r,
            '%': (l, r) => (l % r) === 0
            };

            let result = operators[operator](operand_1, operand_2);
            if (result) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

/* MONGOOSE/MONGODB */
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection;

db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));


/* HOME PAGE */
app.get("/", (req,res) => {
    //console.log(req.session);

    const user = req.session.user;
    res.setHeader("Content-Type", "text/html");
    res.render("index", {
        title: "Animo",
        user: user
    });
});

/* LOGIN PAGE */
const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

/* SIGNUP PAGE */
const signupRouter = require('./routes/signup');
app.use('/signup', signupRouter);

/* LOGOUT ROUTE */
const logoutRouter = require('./routes/logout');
app.use('/logout', logoutRouter);

/* EDIT PROFILE ROUTE */
const editprofileRouter = require('./routes/editprofile');
app.use('/editprofile', editprofileRouter);

/* RUN SERVER */
app.listen(process.env.PORT || 3000, () => console.log("Server running on port http://localhost:3000"));