const express = require('express');
const bodyParser = require('body-parser');
//const graphqlHTTP = require('express-graphql');
//const schema = require('./schema/schema')
const app = express();


const mongodb = require('./data/database');

const port = process.env.PORT || 10000;
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});
app.use('/', require('./routes'));

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

app.listen(port, () => {console.log(`Running on port ${port}.`)});