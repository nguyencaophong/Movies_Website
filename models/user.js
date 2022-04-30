const mongoose = require( 'mongoose' );

const Schema = mongoose.Schema;

const userSchema = new Schema( {
    email: {
        type: String,
        require: true
    },
    password:{
        type : String,
        require: true
    },
    role: String,
    resetToken: String,
    resetTOkenExpiration: Date,
    cart:{
        items:[
            {
                movieId:{
                    type:Schema.Types.ObjectId,
                    ref:'Movie',
                    require: true
                }
            }
        ]
    }
} )


module.exports = mongoose.model( 'User',userSchema );