const mongoose = require( 'mongoose' )

const { validationResult } = require( 'express-validator' )
const bcrypt = require( 'bcryptjs' );
const path = require( 'path' );
const Movie = require( '../models/movie' )
const User = require( '../models/user' )

exports.getAddMovies = async ( req,res ) =>{
    res.render( 'admin/edit-movie',{
        pageTitle: 'Add Product',
        path:'/admin/edit-movie',
        editing:false,
        hasError: false,
        errorMessage: null,
        validationErrors:[]
    } );
}

exports.postAddMovies =async ( req,res ) =>{

    const name = req.body.name;
    const movieurl = req.body.movieurl;
    const images = req.file;
    const description = req.body.description;
    const character = req.body.character;
    const director = req.body.director;
    const national = req.body.national;
    const producer = req.body.producer;
    const typeFilm = req.body.typeFilm;
    
    const typeFilmArray = ['Phim-Bộ','Phim-Thuyết-Minh','Phim-Sắp-Chiếu','Hoạt-Hình','Phim-Lẻ','Cổ Trang - Thần Thoại']

    const checkTypeFilm = typeFilmArray.includes( typeFilm );

    const errors = validationResult( req )


    if( !errors.isEmpty() ) {
        return res.status( 422 ).render( 'admin/edit-movie',{
            pageTitle: 'Add Movie',
            path: 'admin/add-movie',
            editing: false,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            movie: {
                name:name,
                movieurl: movieurl,
                description: description,
                director: director,
                character: character,
                national: national,
                producer: producer,
                typeFilm: typeFilm
            },
            validationErrors: errors.array()
        } )
    }

    if( checkTypeFilm === false ) {
        return res.status( 422 ).render( 'admin/edit-movie',{
            pageTitle: 'Add Movie',
            path: 'admin/add-movie',
            editing: false,
            hasError: true,
            errorMessage: 'Type Film không hợp lệ, vd : [Phim-Bộ, Phim-Thuyết-Minh, Phim-Sắp-Chiếu...',
            movie: {
                name:name,
                movieurl: movieurl,
                description: description,
                director: director,
                character: character,
                national: national,
                producer: producer,
                typeFilm: typeFilm
            },
            validationErrors: errors.array()
        } )
    }

    if( !images ) {
        return res.status( 422 ).render( 'admin/edit-movie',{
            pageTitle: 'Add Movie',
            path: 'admin/add-movie',
            editing: false,
            hasError: true,
            errorMessage: 'Attached file is not an image.',
            movie: {
                name:name,
                movieurl: movieurl,
                description: description,
                director: director,
                character: character,
                national: national,
                producer: producer,
                typeFilm: typeFilm
            },
            validationErrors: errors.array()
        } )
    }

    try {
        if( images!==undefined ) {
            const imageUrl = images.path;
            const movie =await new Movie( {
                name: name,
                movieUrl: movieurl,
                description: description,
                director: director,
                character: character,
                national: national,
                producer: producer,
                imageUrl:imageUrl,
                typeFilm: typeFilm,
                userId: req.user
            } )
            await movie.save();
            res.redirect( '/admin/add-movie' )
            console.log( 'Created Movie success' );
        }
    } catch ( error ) {
        console.log( error )
    }
    
}


exports.getEditMovie = async ( req,res,next ) =>{
    res.send( 'get edit movie' )
}

exports.postEditMovie = async( req,res,next ) =>{
    res.send( 'edit movie' )
}

exports.getIndex = async( req,res ) =>{
    try {
        res.render( 'admin/AdminHome/index.ejs' )
    } catch ( error ) {
        console.log( error );
    }
}

exports.getAllUser = async( req,res ) =>{
    try {
        const getAllUser = await User.find();
        res.render( 'admin/AdminHome/index.ejs',{
            path:'/admin/get-all-user',
            pageTitle:'U S E R',
            users: getAllUser,
            id: 0
        } )
    } catch ( error ) {
        console.log( error );
    }
}

exports.getEditUser = async( req,res ) =>{
    try {
        const editMode = req.query.edit;
        if( !editMode ) {
            res.redirect( '/' );
        }

        const userId = req.params.id;
        const userDetail =await User.findById( userId );
        
        if( !userDetail ) {
            res.redirect( '/' );
        }

        res.render( 'admin/EditUserHome/index.ejs',{
            pageTitle:`U S E R : ${userDetail.email}`,
            path:'/admin/get-all-user',
            user: userDetail,
            editing: editMode,
            hashError: false,
            errorMeassage:null,
            oldInput: {
                email: userDetail.email,
                password: ''
            },
            validationErrors: []
        } )
        
    } catch ( error ) {
        console.log( error );
    }
}

exports.postEditUser = async( req,res ) =>{
    const email = req.body.email;
    const password = req.body.password;
    const userId = req.body.userId;

    const error = validationResult( req );

    const userDetail =await User.findById( userId );
    if( !userDetail ) {
        return res.status( 422 ).render( 'admin/EditUserHome/index.ejs', {
            path: `/get-all-user/${userId}/edit`,
            pageTitle: `U S E R : ${userDetail.email}`,
            errorMeassage: 'Can not find User.',
            editing: true,
            hashError: true,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: [ ]
        } )
    }
    
    if( !error.isEmpty() ) {
        return res.status( 422 ).render( 'admin/EditUserHome/index.ejs' ,{
            user: userDetail,
            path: `/get-all-user/${userId}/edit`,
            pageTitle:`U S E R : ${userDetail.email}`,
            errorMeassage: error.array()[0].msg,
            editing: true,
            hashError: true,
            oldInput:{
                email:email,
                password:password
            },
            validationErrors: error.array()
        } )
    }

    try {
        const bcryptPassword = await bcrypt.hash( password, 12 );
        userDetail.email = email;
        userDetail.password= bcryptPassword;

        await userDetail.save();
        console.log( 'UPDATED USER' );
        res.redirect( '/admin/get-all-user' )
    } catch ( error ) {
        console.log( error );
    }


}

exports.deleteUser = async( req,res ) =>{
    try {
        const userId = req.body.userId;
        console.log( userId )
        await User.deleteOne( {_id: userId} );
        console.log( 'DELETED USER SUCCESS !' )
        res.redirect( '/admin/get-all-user' );
    } catch ( error ) {
        console.log( error );
    }
}