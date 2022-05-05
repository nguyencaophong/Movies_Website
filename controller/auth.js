const path = require( 'path' )
const crypto = require( 'crypto' )
const bcrypt = require( 'bcryptjs' );
const nodemailer = require( 'nodemailer' );
const sendgridTransport = require( 'nodemailer-sendgrid-transport' )
const { validationResult } = require( 'express-validator' );
const flash = require( 'express-flash' );
const User = require( '../models/user' );
const Movie = require( '../models/movie' );

const transporter = nodemailer.createTransport(
    sendgridTransport( {
        auth: {
            api_key: process.env.API_KEY_SENDGRID
        }
    } )
)

exports.getLogin = async( req,res ) =>{
    let message = validationResult( req );
    if( message.length >0 ) {
        message = message[0]
    }
    else{
        message = null
    }

    res.render( 'auth/login',{
        path:'/login',
        pageTitle: 'Login',
        errorMeassage : message,
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    } )
}

exports.postLogin = async( req,res,next ) =>{
    const email = req.body.email;
    const password = req.body.password;

    const erros = validationResult( req );

    if( !erros.isEmpty() ) {
        return res.status( 422 ).render( 'auth/login' ,{
            path: 'login',
            pageTitle:'Login',
            errorMeassage: erros.array()[0].msg,

            oldInput:{
                email:email,
                password:password
            },
            validationErrors: erros.array()
        } )
    }

    try {
        const userLogin = await User.findOne( {email: email} );
        if( !userLogin ) {
            return res.status( 422 ).render( 'auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMeassage: 'Invalid email or password.',
                oldInput: {
                    email: email,
                    password: password
                },
                validationErrors: [ ]
            } )
        }

        const checkPassword = await bcrypt.compare( password, userLogin.password )

        if ( checkPassword ) {
            req.session.isLoggedIn = true
            req.session.user = userLogin
            await req.session.save()
            res.redirect( '/' )
        } else {
            res.status( 422 ).render( 'auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMeassage: 'Invalid email or password.',
                oldInput: {
                    email: email,
                    password: password
                },
                validationErrors: []
            } )
        }

    } catch ( error ) {
        console.log( error )
    }
}

exports.getRegister = async( req,res ) =>{
    let message = validationResult( req );
    if ( message.length > 0 ) {
        message = message[0]
    } else {
        message = null
    }
    res.render( 'auth/register', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMeassage: null,
        oldInput: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: []
    } )
}

exports.postRegister = async ( req,res ) =>{
    const email = req.body.email
    const password = req.body.password

    const errors = validationResult( req )
    if ( !errors.isEmpty() ) {
        return res.status( 422 ).render( 'auth/register', {
            path: '/auth/register',
            pageTitle: 'Signup',
            errorMeassage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
                confirmPassword: req.body.confirmPassword,
                roleUser: req.body.roleUser
            },
            validationErrors: errors.array()
        } )
    }

    try {
        const bcryptPassword = await bcrypt.hash( password, 12 )
        const user = new User( {
            email: email,
            password: bcryptPassword,
            role: 'user',
            cart: { items: [] }
        } )

        await user.save()
        res.redirect( '/auth/login' )

    } catch ( error ) {
        console.log( error )
    }
}

exports.getReset = async( req,res ) =>{

    try {
        res.render( 'auth/reset', {
            path: '/reset',
            pageTitle: 'Reset Password',
            errorMeassage: null
        } )
    } catch ( error ) {
        console.log( error )
    }

}

exports.postReset = async( req,res ) =>{
    let token = ''
    const hashResetToken = crypto.randomBytes( 32, ( err, buffer ) => {
        if ( err ) {
            console.log( err ,'check error' )
            res.redirect( '/auth/reset' )
        }
        token = buffer.toString( 'hex' )
    } )

    try {
        const userDetail = await User.findOne( { email: req.body.email } )

        if ( !userDetail ) {
            req.flash( 'error', 'No account with that email found.' )
            res.redirect( '/auth/reset' )
        }

        userDetail.resetToken = token
        userDetail.resetTokenExpiration = Date.now() + 3600000

        await userDetail.save()

        await transporter.sendMail( {
            to: req.body.email,
            from: process.env.EMAIL_SENDGRID,
            subject: 'Password reset',
            html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="http://localhost:8000/auth/new-password/${token}">link</a> to set a new password.</p>
              `
        } )
        console.log( 'Send email success!' )

        res.redirect( '/' )
    } catch ( error ) {
        console.log( error )
    }
}

exports.getNewPassword = async ( req, res, next ) => {
    const token = req.params.token
    let message = flash( 'error' )

    try {
        const userDetail = await User.findOne( {
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        } )

        if ( message.length > 0 ) {
            message = message[0]
        } else {
            message = null
        }
        res.render( 'auth/new-password', {
            path: '/new-password',
            pageTitle: 'New Password',
            errorMeassage: message,
            userId: userDetail._id.toString(),
            passwordToken: token
        } )
    } catch ( error ) {
        console.log( error )
    }
}

exports.postNewPassword = async ( req, res, next ) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    let resetUser;

    try {
        const userDetail = await User.findOne( {
            resetToken: passwordToken,
            resetTokenExpiration: { $gt: Date.now() },
            _id: userId
        } )

        resetUser = userDetail
        const hashedPassword = await bcrypt.hash( newPassword, 12 )

        userDetail.password = hashedPassword
        userDetail.resetToken = undefined
        userDetail.resetTokenExpiration = undefined
        await userDetail.save()
        res.redirect( '/auth/login' )
    } catch ( error ) {
        console.log( error )
    }
}

exports.logOut = ( req,res ) =>{
    req.session.destroy( function( err ) {
        if( err ) {
            console.log( err );
        }
        res.redirect( '/' )
    } )
}

exports.getCart = async( req,res ) =>{
    const movieId = req.user._id
    
    try {
        const userDetail =await User.findById( movieId );

        
    } catch ( error ) {
        
    }
}

exports.postCart = async( req,res ) =>{
    const movieId = req.body.movieId;

    try {
        const movieDetail = await Movie.findById( movieId );
        const addMovietoCart = await req.user.addToCart( movieDetail );
        const nameMovie = movieDetail.name;
        res.redirect( `/film/${movieDetail.name}` )
        
    } catch ( error ) {
        console.log( error )
    }
}
