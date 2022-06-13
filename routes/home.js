const path = require( 'path' );
const express =require( 'express' );
const homeController = require( '../controller/home' )
const is_auth = require( '../middleware/is-auth' );

const router = express.Router();

router.get( '/watching/:name',is_auth,homeController.getWatchMovie )

router.get( '/film/:name',is_auth,homeController.getMovieDetail )

router.post( '/search',homeController.searchMovie )

router.get( '/' ,homeController.getIndex );


module.exports = router;