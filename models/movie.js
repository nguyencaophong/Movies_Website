const mongoose = require( 'mongoose' );

const Schema = mongoose.Schema


const movieSchema = new Schema( {
    name:{
        type:String,
        require: true
    },
    director:{
        type: String,
        require: true
    },
    character:{
        type: String,
        require: true
    },
    national: String,
    producer: {
        type: String
    },
    description:{
        type:String,
        require: true
    },
    imageUrl:{
        type: String,
        require: true
    },
    typeFilm: {
        type:String
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User',
        require: true
    }
} )


module.exports = mongoose.model( 'Movie',movieSchema );