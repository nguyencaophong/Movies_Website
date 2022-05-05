const path = require( 'path' )
const express = require( 'express' )
const mongoose = require( 'mongoose' )
const {check } = require( 'express-validator' );
const authController = require( '../controller/auth' );
const User = require( '../models/user' )
const route = express.Router()

route.get( '/login',authController.getLogin );

route.post( '/login',
    [
        check( 'email' )
            .isEmail()
            .withMessage( 'Please enter a valid email address.' )
            .normalizeEmail(),
        check( 'password' )
            .exists()
            .isLength( { min: 5 } )
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin 
)

route.get( '/register',authController.getRegister );

route.post( '/register',
    [
        check( 'email' )
            .isEmail()
            .withMessage( 'Please enter a valid email.' )
            .custom( ( value, { req } ) => {
                return User.findOne( { email: value } ).then( userDoc => {
                    if ( userDoc ) {
                        return Promise.reject(
                            'E-Mail exists already, please pick a different one.'
                        );
                    }
                } );
            } )
            .normalizeEmail(),
        check(
            'password',
            'Please enter a password with only numbers and text and at least 5 characters.' )
            .isLength( { min: 5 } )
            .isAlphanumeric()
            .trim(),
        check( 'confirmPassword' )
            .trim()
            .custom( ( value, { req } ) => {
                if ( value !== req.body.password ) {
                    throw new Error( 'Passwords have to match!' );
                }
                return true;
            } )
    ]
    ,authController.postRegister );

route.get( '/reset',authController.getReset );

route.post( '/reset',authController.postReset );

route.get( '/new-password/:token',authController.getNewPassword );

route.post( '/new-password',authController.postNewPassword );

route.get( '/logout',authController.logOut );

route.get( '/cart',authController.getCart );

route.post( '/cart',authController.postCart );

module.exports = route;