const path = require( 'path' );
const express = require( 'express' );
const mongoose = require( 'mongoose' );
const session = require( 'express-session' );
const MongoDBStore = require( 'connect-mongodb-session' )( session );
const csrf = require( 'csurf' );
const flash = require( 'connect-flash' );
const dotenv = require( 'dotenv' );
const multer = require( 'multer' );
const route = require( './routes' );
const bodyParser = require( 'body-parser' );


const PORT = 8000
const MONGOGDB_URL = 'mongodb://localhost:27017/Movies_Website';

const app = express();
const store = new MongoDBStore( {
    uri: MONGOGDB_URL,
    collection: 'sessions'
} );

dotenv.config();


// upload file img and convert path to static in project
const fileStorage = multer.diskStorage( {
    destination: ( req, file, cb ) => {
        cb( null,'./images' );
    },
  
    filename: ( req, file, cb ) => {
        cb( null, Date.now() +'--'+ file.originalname );
    }
} );

const fileFilter = ( req, file, cb ) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb( null, true );
    } else {
        cb( null, false );
    }
};

app.set( 'view engine', 'ejs' );

app.use( bodyParser.urlencoded( { extended: false } ) );
app.use(
    multer( { storage: fileStorage, fileFilter: fileFilter } ).single( 'image' )
);

app.use( express.static( path.join( __dirname, 'public' ) ) );

app.use( '/images', express.static( path.join( __dirname, 'images' ) ) );

app.use(
    session( {
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    } )
);
route( app );

app.use( flash() );
app.use( csrf() );


app.use( ( req,res,next ) =>{
    res.locals.csrfToken = req.csrfToken()
    next();
} )


mongoose
    .connect( MONGOGDB_URL, { useNewUrlParser: true, useUnifiedTopology: true  } )
    .then( result => {                     
        console.log( `Server running on PORT ${PORT}` )
        app.listen( PORT );
    } )
    .catch( err => {                
        console.log( err );
    } );