const path = require( 'path' );
const express =require( 'express' );
const adminController = require( '../controller/admin' );
const {check } = require( 'express-validator' );
const isAuth = require( '../middleware/is-auth' );
const checkRole = require( '../middleware/check-Role' )

const router = express.Router();

router.get( '/',adminController.getIndex );

router.get( '/get-all-user/:id',adminController.getEditUser );

router.post( '/get-all-user',
    [
        check( 'email' )
            .isEmail()
            .withMessage( 'Please enter a valid email address.' )
            .normalizeEmail(),
        check( 'password','Please enter your password' )
            .exists()
            .isLength( { min: 5 } )
            .isAlphanumeric()
            .trim()
    ]
    ,adminController.postEditUser );

router.get( '/get-all-user',adminController.getAllUser );

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

router.post( '/delete-user',adminController.deleteUser );

module.exports = router;