const path = require( 'path' )
const express = require( 'express' )
const mongoose = require( 'mongoose' )

const authController = require( '../controller/auth' );

const route = express.Router()

route.get( '/login',authController.getLogin );

route.post( '/login',authController.postLogin )

route.get( '/register',authController.getRegister );

route.post( '/register',authController.postRegister );

route.get( '/reset',authController.getReset );

route.post( '/reset',authController.postReset );

route.get( '/new-password',authController.getNewPassword );

route.post( '/new-password',authController.postNewPassword );


module.exports = route;