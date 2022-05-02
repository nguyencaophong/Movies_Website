const homeRouter = require( './home' );
// const authRouter = require( './auth' );
const adminRouter = require( './admin' );

function route( app ) {
    app.use( '/admin',adminRouter );

    
    app.use( '/',homeRouter );
}

module.exports = route;
