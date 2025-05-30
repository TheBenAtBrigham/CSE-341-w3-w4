const express = require('express');
const bodyParser = require('body-parser');
//const graphqlHTTP = require('express-graphql');
//const schema = require('./schema/schema')
const mongodb = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const GithubStrategy = require('passport-github2').Strategy;
const cors = require('cors');



const port = process.env.PORT || 3000;
const app = express();


app
    .use(bodyParser.json())
    .use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
    }))
    //express session ({..}) initialization.
    .use(passport.initialize())
    //init passport on every route call.
    .use(passport.session())
    //allow passsport to use express-session.
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
        );
        res.setHeader(
            'Access-Control-Allow-Methods', 
            'POST, GET, PUT, DELETE, OPTIONS, PATCH');
        next();
    })
    .use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}))
    .use(cors({ origin: '*' }))
    .use('/', require('./routes/index.js'));

passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
}, function(accessToken, refreshToken, profile, done) {return done(null, profile)}));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', (req, res) => {res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` :  "Logged Out")});
app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: false}), 
    (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});


/*app.use('/graphql', graphqlHTTP({
    //directing express-graphql to use this schema to map out the graph 
    schema,
    //directing express-graphql to use graphiql when goto '/graphql' address in the browser
    //which provides an interface to make GraphQl queries
    graphiql:true
}));*/

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    }
    else
    {
        app.listen(port, () => {console.log(`Database is listening and node running on port ${port}`)});
    }
});

//app.listen(port, () => {console.log(`Running on port ${port}.`)});