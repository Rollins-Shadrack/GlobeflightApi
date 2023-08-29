const express = require('express')
const Transaction  = require('../models/Transaction')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router();

router.get('/transactions',protect,  async(req,res) =>{
    try{
        const transaction = await Transaction.find().limit(50).sort({createdOn: -1})
        res.status(200).json(transaction)

    }catch(error){
        res.status(404).json({message: error.message})
    }
})


module.exports = router;