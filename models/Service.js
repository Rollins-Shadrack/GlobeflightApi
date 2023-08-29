const mongoose = require('mongoose')

const Schema = mongoose.Schema


const ServiceSchema= new Schema({
    createdBy:{
        type:Object
    },
    companyName:{
        type: String,
        required: true
    },
    contactPerson:{
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true
    },
    country:{
        type: String,
    },
    town:{
        type: String,
    },
    email:{
        type: String,
        required: true
    },
    engagementPurpose:{
        type: String,
        required: true
    },
    action:{
        type:String,
        required: true
    },
    order:[{
        type:String,
        required: true
    }],
    transport:{
        type:String,
    },
    packages:{
        type:Number,
    },
    consignment:{
        type:String,
    },
    specifications:{
        type:String,
    },
    description:{
        type:String,
    },
    dimension:{
        type:String,
    },
    measure:{
        type:String,
    },
    weight:{
        type:Number,
    },
    ecoterm:{
        type:String,
    },
    origin:{
        type:String,
    },
    destination:{
        type:String,
    },
    currency:[{
        type:String,
    }],
    amount:[{
        type:Number,
    }],
    document:[{
        type:String,
    }],
    shipperLocation:{
        type:String,
    },
    shipperContact:{
        type:String,
    },
    shipperPhone:{
        type:String,
    },
    shipperEmail:{
        type:String,
    },
    reports:[{
        message: {
          type: String,
          required: true,
        },
        issuedBy: {
          type: Object,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
        type: String,
        default: 'Not Approved'
      },
      
    revenue:{
        type: Number,
      },

    operationalExpense:{
    type: Number,
    },

    nonOperationalExpense:{
    type: Number,
    },
    driver:{
        type:String,
    },
    progress: {
        type: String,
    },

},
{timestamps: true}
)
const Service = mongoose.model("Service", ServiceSchema)

module.exports = Service