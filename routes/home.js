const path = require( 'path' );
const express =require( 'express' );
const homeController = require( '../controller/home' )


const router = express.Router();

router.get( '/watching/:name',homeController.getWatchMovie )
router.get( '/film/:name',homeController.getMovieDetail )
router.get( '/' ,homeController.getIndex );


module.exports = router;