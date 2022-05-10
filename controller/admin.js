const mongoose = require( 'mongoose' )

const { validationResult } = require( 'express-validator' )
const bcrypt = require( 'bcryptjs' );
const path = require( 'path' );
const Movie = require( '../models/movie' )
const User = require( '../models/user' )


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
            isMoviePage: false,
            users: getAllUser
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
            userId: userDetail._id,
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
    const userId =req.body.userId;
    const error = validationResult( req );

    const userReal = await User.findById( userId );
    const userDetail =await User.findOne( {email: email} );

    if( !error.isEmpty() ) {
        return res.status( 422 ).render( 'admin/EditUserHome/index.ejs' ,{
            user: userDetail,
            userId: userId,
            path: '',
            pageTitle:`U S E R : ${userReal.email}`,
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

    
    if( !userDetail ) {
        return res.status( 422 ).render( 'admin/EditUserHome/index.ejs', {
            userId: userId,
            path: '',
            pageTitle: `U S E R : ${userReal.email}`,
            errorMeassage: 'Can not find User.',
            editing: true,
            hashError: true,
            oldInput: {
                email: '',
                password: password
            },
            validationErrors: [ ]
        } )
    }

    if( userDetail.email !== userReal.email ) {
        return res.status( 422 ).render( 'admin/EditUserHome/index.ejs', {
            userId: userId,
            path: '',
            pageTitle: `U S E R : ${userReal.email}`,
            errorMeassage: 'E-mail input not match email of this User!',
            editing: true,
            hashError: true,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: [ ]
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

        await User.deleteOne( {_id: userId} );
        console.log( 'DELETED USER SUCCESS !' )
        res.redirect( '/admin/get-all-user' );
    } catch ( error ) {
        console.log( error );
    }
}


exports.getAddUser = async( req,res ) =>{


    try {
        res.render( 'admin/EditUserHome/index.ejs' ,{
            pageTitle:'ADD U S E R',
            path:'/add-user',
            errorMeassage:null,
            editing:false,
            hasError: false,
            oldInput:{
                email:'',
                password:'',
                retypepassword: ''
            },
            validationErrors:[]
        } )
    } catch ( error ) {
        console.log( error )
    }
}

exports.postAddUser = async( req,res ) =>{
    const email = req.body.email;
    const password =req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const error = validationResult( req );

    const userDetail = await User.findOne( {email: email} );
    if( !error.isEmpty() ) {
        return res.status( 422 ).render( 'admin/EditUserHome/index.ejs',{
            pageTitle:'ADD U S E R',
            path: '/add-user',
            editing: false,
            hasError: false,
            errorMeassage:error.array()[0].msg,
            oldInput:{
                email: email,
                password: password,
                confirmPassword: confirmPassword
            },
            validationErrors: error.array()
        } )
    }  

    if( userDetail ) {
        return res.status( 422 ).render( 'admin/EditUserHome/index.ejs',{
            pageTitle:'ADD U S E R',
            path: '/add-user',
            editing: false,
            hasError: false,
            errorMeassage:'E-Mail exists already, please pick a different one.',
            oldInput:{
                email: email,
                password: password,
                confirmPassword: confirmPassword
            },
            validationErrors: error.array()
        } )
    }


    try {
        const bcryptPassword = await bcrypt.hash( password,12 );
        const user = new User( {
            email: email,
            password: bcryptPassword
        } )
        await user.save();

        res.redirect( '/admin/get-all-user' );
        console.log( 'CREATED USER SUCCESS !' );
        
    } catch ( error ) {
        console.log( error )
    }

}

exports.searchUser = async( req,res ) =>{
    try {
        const keywordSearch = req.body.keywordSearch;
        const listUser = await User.find();
        
        const listUserDetail = listUser.filter( value =>{
            return value.email.toUpperCase().includes( keywordSearch.toUpperCase() )
        } )

        res.render( 'admin/AdminHome/index.ejs',{
            isMoviePage: false,
            path:'/admin/search-user',
            pageTitle:'SEARCH U S E R',
            users: listUserDetail
        } )
    } catch ( error ) {
        console.log( error )
    }
}


exports.getAllMovie = async( req,res ) =>{
    try {
        const listMovieDetail = await Movie.find();

        res.render( 'admin/AdminHome/index.ejs',{
            pageTitle:'M O V I E S',
            path:'admin/get-all-movie',
            isMoviePage: true,
            movies: listMovieDetail
        } )

    } catch ( error ) {
        console.log( error );
    }
}

exports.postEditMovie = async( req,res ) =>{
    try {
        res.send( 'POST USER' )
    } catch ( error ) {
        console.log( error );
    }
}

exports.searchMovie = async( req,res ) =>{
    
    try {
        const keywordSearch = req.body.keywordSearch;
        const listMovie = await Movie.find();
        
        const listNameDetail = listMovie.filter( value =>{
            return value.name.toUpperCase().includes( keywordSearch.toUpperCase() )
        } )
        const listTypeDetail = listMovie.filter( value =>{
            return value.typeFilm.toUpperCase().includes( keywordSearch.toUpperCase() )
        } )

        const listMoveDetail = listNameDetail.concat( listTypeDetail )

        res.render( 'admin/AdminHome/index.ejs',{
            path:'/admin/search-movie',
            isMoviePage: true,
            pageTitle:'SEARCH M O V I E',
            movies: listMoveDetail
        } )
    } catch ( error ) {
        console.log( error );
    }
}

exports.getAddMovies = async ( req,res ) =>{
    res.render( 'admin/EditMovieHome/index.ejs',{
        pageTitle: 'ADD M O V I E',
        path:'/admin/edit-movie',
        editing:false,
        hasError: false,
        oldInput: {
            name:'',
            movieurl: '',
            description: '',
            director: '',
            character: '',
            national: '',
            producer: '',
            typeFilm: ''
        },
        errorMeassage: null,
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
        return res.status( 422 ).render( 'admin/EditMovieHome/index.ejs',{
            pageTitle: 'ADD M O V I E ',
            path: 'admin/add-movie',
            editing: false,
            hasError: true,
            errorMeassage: errors.array()[0].msg,
            oldInput: {
                name:name,
                movieUrl: movieurl,
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
        return res.status( 422 ).render( 'admin/EditMovieHome/index.ejs',{
            pageTitle: 'Add Movie',
            path: 'admin/add-movie',
            editing: false,
            hasError: true,
            errorMeassage: 'Type Film không hợp lệ, vd : [Phim-Bộ, Phim-Thuyết-Minh, Phim-Sắp-Chiếu...',
            oldInput: {
                name:name,
                movieUrl: movieurl,
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
        return res.status( 422 ).render( 'admin/EditMovieHome/index.ejs',{
            pageTitle: 'Add Movie',
            path: 'admin/add-movie',
            editing: false,
            hasError: true,
            errorMeassage: 'Attached file is not an image.',
            oldInput: {
                name:name,
                movieUrl: movieurl,
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
        res.redirect( '/admin/get-all-movie' )
        console.log( 'Created Movie success' );

    } catch ( error ) {
        console.log( error )
    }
    
}


exports.getEditMovie = async ( req,res ) =>{
    try {
        const modeEdit = req.query.edit;
        const movieId = req.params.id;
        const movieDetail =await Movie.findById( movieId );

        if( !modeEdit ) {
            res.redirect( '/admin/get-all-movie' );
        }
        if( !movieDetail ) {
            res.redirect( '/admin/get-all-movie' );
        }

        res.render( 'admin/EditMovieHome/index.ejs',{
            pageTitle:`M O V I E: ${movieDetail.name}`,
            path:'/admin/get-all-movie',
            movie: movieDetail,
            movieId: movieDetail._id,
            editing: modeEdit,
            hashError: false,
            errorMeassage: null,
            oldInput:{
                name:  movieDetail.name,
                movieUrl:  movieDetail.movieUrl,
                director:  movieDetail.director,
                character:  movieDetail.character,
                national:  movieDetail.national,
                producer:  movieDetail.producer,
                description:  movieDetail.description,
                imageUrl:  movieDetail.imageUrl,
                typeFilm:  movieDetail.typeFilm
            },
            validationErrors: []
        } )           
    } catch ( error ) {
        console.log( error );
    }
}

exports.postEditMovie = async( req,res,next ) =>{
    try {
        const name = req.body.name;
        const movieId = req.body.movieId;
        const movieUrl = req.body.movieurl;
        const director = req.body.director;
        const character = req.body.character;
        const national = req.body.national;
        const producer = req.body.producer;
        const description = req.body.description;
        const imageUrl = req.file;
        const typeFilm = req.body.typeFilm;

        const error = validationResult( req );

        if( !error.isEmpty() ) {
            return res.status( 422 ).render( 'admin/EditMovieHome/index.ejs' ,{
                movieId: movieId,
                path: '',
                pageTitle:`M O V I E : ${name}`,
                errorMeassage: error.array()[0].msg,
                editing: true,
                hashError: true,
                oldInput:{
                    name:  name,
                    movieUrl:  movieUrl,
                    director:  director,
                    character:  character,
                    national:  national,
                    producer:  producer,
                    description:  description,
                    imageUrl:  imageUrl,
                    typeFilm:  typeFilm
                },
                validationErrors: error.array()
            } )
        }

        if( !imageUrl ) {
            return res.status( 422 ).render( 'admin/EditMovieHome/index.ejs' ,{
                movieId: movieId,
                path: '',
                pageTitle:`M O V I E : ${name}`,
                errorMeassage: 'Attached file is not an image.',
                editing: true,
                hashError: true,
                oldInput:{
                    name:  name,
                    movieUrl:  movieUrl,
                    director:  director,
                    character:  character,
                    national:  national,
                    producer:  producer,
                    description:  description,
                    imageUrl:  imageUrl,
                    typeFilm:  typeFilm
                },
                validationErrors: error.array()
            } )
        }

        try {

            const newMovie =await new Movie( {
                movieId:movieId,
                name: name,
                movieUrl: movieUrl,
                imageUrl:imageUrl.path,
                director: director,
                character: character,
                national: national,
                producer: producer,
                description: description,
                typeFilm: typeFilm,
                userId: req.user
            } )
            await newMovie.save();
            res.redirect( '/admin/get-all-movie' );
            console.log( 'EDIT MOVIE SUCCESS !' );
        } catch ( error ) {
            console.log( error );
        }
        
    } catch ( error ) {
        console.log( error );
    }
}