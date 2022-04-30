const express = require( 'express' );
const mongoose = require( 'mongoose' );
const session = require( 'express-session' );
const app = express();

const PORT = 8000
const MONGOGDB_URL = 'mongodb://localhost:27017/Movies_Website';

app.set( 'view engine','ejs' );
app.set( 'views','views' );

mongoose
    .connect( MONGOGDB_URL, { useNewUrlParser: true, useUnifiedTopology: true  } )
    .then( result => {
        console.log( `Server running on PORT ${PORT}` )
        app.listen( PORT );
    } )
    .catch( err => {
        console.log( err );
    } );