/* INITIAL SETUP */
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');
// const mongoose = require('mongoose');
const { connect, mongooseToObj, multipleMongooseToObj } = require('./models/db');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

/* USING DEPENDENCIES */
const app = express();
app.use("/static",express.static(__dirname + "/public"));
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
        /* Equating Helper Function */
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
        },
        /* Capitalize Helper Function */
        uppercase: function (text) {
            if(text) {
                return text.toUpperCase();
            } else {
                return "";
            }
        },
        formatDate: function (date) {
            if (!(date instanceof Date && !isNaN(date))) {
                return '';
            }

            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            };
        
            return date.toLocaleString('en-US', options);
        },
        in: function (username, likes, options) {
            return likes.includes(username) ? options.fn(this) : options.inverse(this);
        },
        gt: function (a, b) {
            return a > b;
        },
        hashPassword: require('./routes/hashPassword').hashPassword
    }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

/* MONGOOSE/MONGODB */
connect();
const User = require('./models/user');
const Community = require('./models/community');

/* HOME PAGE */
app.get("/", async (req,res) => {
    //console.log(req.session);

    const user = req.session.user;
    const communities = multipleMongooseToObj(await Community.find({}));

    res.setHeader("Content-Type", "text/html");
    res.render("index", {
        title: "Animo",
        user: user,
        communities: communities
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

/* USER PROFILE ROUTE */
const userRouter = require('./routes/user');
app.use('/user', userRouter);

/* COMMUNITY ROUTE */
const communityRouter = require('./routes/community');
app.use('/community', communityRouter);

/* SEARCH ROUTE */
const searchRouter = require('./routes/search');
app.use('/search', searchRouter);

/* POSTS ROUTE */
const postRouter = require('./routes/post');
app.use('/post', postRouter);

/* 404 MIDDLEWARE */
// app.use((req,res,err) => {
//     res.status(404);
//     res.render('404', {
//         title: "404"
//     });
// });

/* RUN SERVER */
app.listen(process.env.PORT || 3000, () => console.log("Server running on port http://localhost:3000"));
