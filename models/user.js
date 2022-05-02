
const mongoose = required( 'mongoose' );

const Schema = mongoose.Schema;

const userSchema = new Schema( {
    email: {
        type: String,
        required: true
    },
    password:{
        type : String,
        required: true
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
                    required: true
                },
                quantity: {type: Number , required: true}
            }
        ]
    }
} )

userSchema.methods.addToCart = function ( movie ) {
    const updateCartItems = [...this.cart.items]
    let quantity =0
    quantity = quantity + 1;
    updateCartItems.push( {
        quantity:quantity,
        movieId: movie._id
    } )

    const updateCart = {
        items:updateCartItems
    }

    this.cart = updateCart
    return this.save()
}

userSchema.methods.removeFromCart = function ( movieId ) {
    const updateCartItems = this.cart.items.filter( item =>{
        return item.movieId.toString() !== movieId.toString()

    } )

    this.cart.items = updateCartItems;
    return this.save()
}

userSchema.methods.clearCart = function () {
    this.cart = { items: [] }
    return this.save()
}

module.exports = mongoose.model( 'User',userSchema );