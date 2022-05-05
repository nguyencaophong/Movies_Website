const mongoose = require( 'mongoose' )

const { validationResult } = require( 'express-validator' )
const path = require( 'path' );
const Movie = require( '../models/movie' )

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