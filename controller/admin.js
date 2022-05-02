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
        errorMeassage: null,
        validationErroe:[]
    } );
}

exports.postAddMovies =async ( req,res ) =>{

    const name = req.body.name;
    const images = req.file;
    const description = req.body.description;
    const character = req.body.character;
    const director = req.body.director;
    const national = req.body.national;
    const producer = req.body.producer;
    const typeFilm = req.body.typeFilm;
    
    const errors = validationResult( req )
    if( !errors.isEmpty() ) {
        res.render( 'admin/edit-movie',{
            pageTitle: 'Add Movie',
            path: 'admin/add-product',
            editing: false,
            hasError: true,
            movie: {
                name:name,
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
                description: description,
                director: director,
                character: character,
                national: national,
                producer: producer,
                imageUrl:imageUrl,
                typeFilm: typeFilm
        
            } )
            const saveMovie =await movie.save();
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