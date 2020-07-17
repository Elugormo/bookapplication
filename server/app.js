const express = require('express');
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')
const cors = require('cors')


const app = express();

app.use(cors());


mongoose.connect('mongodb+srv://newUser:test123@cluster0-9sjrp.mongodb.net/test?retryWrites=true&w=majority')
mongoose.connection.once('open', () => {
    console.log('connected to database');
})


app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true    
}));    

app.listen(4000, () => {
    console.log('Listening for requests on port 4000')
} );