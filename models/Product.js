const mongoose = require('mongoose')
const {loadType} = require('mongoose-currency')

const Schema = mongoose.Schema

loadType(mongoose)

const ProductSchema= new Schema({
    image:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    stock:{
        type:Number,
        required: true
    },
    price:{
        type: mongoose.Types.Currency,
        currency: "KSH"
    },
    expense:{
        type: mongoose.Types.Currency,
        currency: "KSH"
    },
    transactions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction"
    }]

},
{timestamps: true, toJSON:{getters : true}}
)
const Product = mongoose.model("Products", ProductSchema)

module.exports = Product