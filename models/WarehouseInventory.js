const mongoose = require('mongoose')

const Schema = mongoose.Schema

const warehouseSchema = new Schema({
    createdBy:{
        type:Object
    },
    itemName:{
        type: String,
        required: true
    },
    itemDescription:{
        type: String,
        required: true
    },
    itemCategory:{
        type: String,
        required: true
    },
    itemQuantity:{
        type: String,
        required: true
    },
    itemMeasurement:{
        type: String,
        required: true
    },
    itemDimensions:{
        type: String,
        required: true
    },
    itemPackaging:{
        type: String,
        required: true
    },
    itemValue:{
        type:String,
        required: true
    },
    itemHandling:{
        type:String,
        required: true
    },
    itemStorage:{
        type:String,
        required: true
    },
    exitDate:{
        type:Date,
        required: true
    },
    customerName:{
        type:String,
        required: true
    },
    customerEmail:{
        type:String,
        required: true
    },
    customerMobile:{
        type:String,
        required: true
    },
    driver:{
        type:String,
    },
    price:{
        type:String,
        required: true
    }
}, {timestamps: true})

const WarehouseInventory = mongoose.model("WarehouseInventory", warehouseSchema)

module.exports = WarehouseInventory