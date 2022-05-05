const path = require( 'path' );
const express =require( 'express' );
const adminController = require( '../controller/admin' );
const {check } = require( 'express-validator' );

const router = express.Router();


router.get( '/add-movie',adminController.getAddMovies );

router.post( '/add-movie',
    [
        check( 'name','This username must me 3+ characters long' )
            .exists()
            .isLength( {min:3} )
            .trim(),
        check( 'movieurl','This Movie Url must me 3+ characters long' )
            .exists()
            .isLength( {min:5,max:500} )
            .trim(),
        check( 'description','This description must me 3+ characters long' )
            .exists()
            .isLength( {min:5,max:500} )
            .trim(),
        check( 'director','This director must me 3+ characters long'  )
            .exists()
            .isString().isLength( {min:3} )
            .trim(),
        check( 'character','This character must me 3+ characters long'  )
            .exists()
            .isString()
            .isLength( {min:3} )
            .trim(),
        check( 'national','This national must me 3+ characters long'  )
            .exists()
            .isString()
            .isLength( {min:3} )
            .trim(),
        check( 'producer','This producer must me 3+ characters long'  )
            .exists()
            .isString()
            .isLength( {min:3} )
            .trim(),
        check( 'typeFilm','This typefilm must me 3+ characters long'  )
            .exists()
            .isString()
            .isLength( {min:3} )
            .trim()
    ],
    adminController.postAddMovies 
);

router.post( '/edit-movie', adminController.postEditMovie );

module.exports = router;