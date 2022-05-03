const path = require( 'path' )

const User = require( '../models/user' );

exports.getLogin = async( req,res ) =>{
    res.render( 'auth/login.ejs' )
}

exports.postLogin = async( req,res,next ) =>{
    res.send( 'word' )
}

exports.getRegister = async( req,res ) =>{
    res.render( 'auth/register.ejs' )
}

exports.postRegister = async ( req,res ) =>{
    res.send( 'post register' )
}

exports.getReset = async( req,res ) =>{
    res.render( 'auth/reset.ejs' )

}

exports.postReset = async( req,res ) =>{
    res.send( 'post reset' )
}

exports.getNewPassword = async( req,res ) =>{
    res.render( 'auth/new-password.ejs' )
}

exports.postNewPassword = async( req,res ) =>{
    res.send( 'post new password' )
}