const path = require( 'path' );
const express =require( 'express' );
const adminController = require( '../controller/admin' );
const {check } = require( 'express-validator' );
const isAuth = require( '../middleware/is-auth' );
const checkRole = require( '../middleware/check-Role' )

const router = express.Router();

router.get( '/',adminController.getIndex );

// CRUD USER
router.get( '/get-all-user/:id',adminController.getEditUser );

router.post( '/edit-user',
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

router.get( '/add-user',adminController.getAddUser );

router.post( '/add-user',
    [
        check( 'email' )
            .isEmail()
            .withMessage( 'Please enter a valid email.' )
            .normalizeEmail(),
        check( 'password','Please enter your password' )
            .exists()
            .isLength( { min: 5 } )
            .isAlphanumeric()
            .trim(),
        check( 'confirmPassword','Please enter a confirm password  .' )
            .exists()
            .isLength( { min: 5 } )
            .custom( ( value, { req } ) => {
                if ( value !== req.body.password ) {
                    throw new Error( 'Passwords have to match!' );
                }
                return true;
            } )
            .trim()
    ]
    ,adminController.postAddUser );

router.post( '/delete-user',adminController.deleteUser );

router.post( '/search-user' ,adminController.searchUser ); 


// CRUD MOVIE
router.get( '/get-all-movie',adminController.getAllMovie );

router.get( '/get-all-movie/:id',adminController.getEditMovie );

router.post( '/edit-movie',
    [
        check( 'name','This username must me 5+ characters long' )
            .exists()
            .isLength( {min:5} )
            .trim(),
        check( 'movieurl','This Movie Url must me 5+ characters long' )
            .exists()
            .isLength( {min:5,max:500} )
            .trim(),
        check( 'description','This description must me 5+ characters long' )
            .exists()
            .isLength( {min:5,max:500} )
            .trim(),
        check( 'director','This director must me 5+ characters long'  )
            .exists()
            .isString().isLength( {min:5} )
            .trim(),
        check( 'character','This character must me 5+ characters long'  )
            .exists()
            .isString()
            .isLength( {min:5} )
            .trim(),
        check( 'national','This national must me 5+ characters long'  )
            .exists()
            .isString()
            .isLength( {min:5} )
            .trim(),
        check( 'producer','This producer must me 5+ characters long'  )
            .exists()
            .isString()
            .isLength( {min:5} )
            .trim(),
        check( 'typeFilm','This typefilm must me 5+ characters long'  )
            .exists()
            .isString()
            .isLength( {min:5} )
            .trim()
    ],
    adminController.postEditMovie )


router.get( '/add-movie',adminController.getAddMovies );

router.post( '/add-movie',
    [
        check( 'name','This username must me 5+ characters long' )
            .exists()
            .isLength( {min:5} )
            .trim(),
        check( 'movieurl','This Movie Url must me 5+ characters long' )
            .exists()
            .isLength( {min:5,max:500} )
            .trim(),
        check( 'description','This description must me 5+ characters long' )
            .exists()
            .isLength( {min:5,max:500} )
            .trim(),
        check( 'director','This director must me 5+ characters long'  )
            .exists()
            .isString().isLength( {min:5} )
            .trim(),
        check( 'character','This character must me 5+ characters long'  )
            .exists()
            .isString()
            .isLength( {min:5} )
            .trim(),
        check( 'national','This national must me 5+ characters long'  )
            .exists()
            .isString()
            .isLength( {min:5} )
            .trim(),
        check( 'producer','This producer must me 5+ characters long'  )
            .exists()
            .isString()
            .isLength( {min:5} )
            .trim(),
        check( 'typeFilm','This typefilm must me 5+ characters long'  )
            .exists()
            .isString()
            .isLength( {min:5} )
            .trim()
    ],
    adminController.postAddMovies 
);

router.post( '/search-movie',adminController.searchMovie );

module.exports = router;