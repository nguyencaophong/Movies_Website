const mongoose = require( 'mongoose' );

const Schema = mongoose.Schema


const movieSchema = new Schema( {
    name:{
        type:String,
        required: true
    },
    director:{
        type: String,
        required: true
    },
    character:{
        type: String,
        required: true
    },
    national: String,
    producer: {
        type: String
    },
    description:{
        type:String,
        required: true
    },
    imageUrl:{
        type: String,
        required: true
    },
    typeFilm: {
        type:String
    }
    // userId:{
    //     type: Schema.Types.ObjectId,
    //     ref:'User',
    //     required: true
    // }
} )


module.exports = mongoose.model( 'Movie',movieSchema );