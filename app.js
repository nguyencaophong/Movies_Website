const path = require( 'path' );
const express = require( 'express' );
const mongoose = require( 'mongoose' );
const session = require( 'express-session' );
const MongoDBStore = require( 'connect-mongodb-session' )( session );
const flash = require( 'connect-flash' );
const cookieParser = require( 'cookie-parser' );
const multer = require( 'multer' );
const csrf = require( 'csurf' );
const dotenv = require( 'dotenv' );
const route = require( './routes/index' );
const bodyParser = require( 'body-parser' );
const User = require( './models/user' );
const methodOverride = require( 'method-override' )

const PORT = 8000
const MONGOGDB_URL = 'mongodb://localhost:27017/Movies_Website';


const app = express();
const store = new MongoDBStore( {
    uri: MONGOGDB_URL,
    collection: 'sessions'
} );

app.use( methodOverride( '_method' ) );
const csrfProtection = csrf();
dotenv.config();


// upload file img and convert path to static in project
const fileStorage = multer.diskStorage( {
    destination: ( req, file, cb ) => {
        cb( null, './images' );
    },

    filename: ( req, file, cb ) => {
        cb( null, Date.now() + '--' + file.originalname );
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
app.set( 'views', 'views' );

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

app.use( csrfProtection );
app.use( flash() );

app.use( ( req, res, next ) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();

    if( ( req.session.user )!==undefined ) {
        res.locals.roleUser = req.session.user.role;
    }
    next();
} );


app.use( async ( req, res, next ) => {

    if ( !req.session.user ) {
        return next();
    }
    try {     
        const userDetail =await User.findById( req.session.user._id );
        if( !userDetail ) {
            return next();
        }
        req.user =userDetail;
        next()
    } catch ( error ) {
        console.log( error )
    }

} );


route( app );


mongoose
    .connect( MONGOGDB_URL, { useNewUrlParser: true, useUnifiedTopology: true  } )
    .then( result => {                     
        console.log( `Server running on PORT: http://localhost:${PORT}` )
        app.listen( PORT );
    } )
    .catch( err => {                
        console.log( err );
    } );
