const mongoose = require( 'mongoose' );

const cartUserSchema = mongoose.Schema( {
    movies:[
        {
            movie:{
                type: Object,
                required: true
            }
        }
    ],
    user:{
        email:{
            type: String,
            required: true
        },
        userId: {
            // eslint-disable-next-line no-undef
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }
} )

module.exports = mongoose.model( 'cartUser',cartUserSchema );