const express = require('express')
const KPI  = require('../models/KPI')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router();

router.get('/kpis', protect, async(req,res) =>{
    try{
        const kpis = await KPI.find()
        res.status(200).json(kpis)

    }catch(error){
        res.status(404).json({message: error.message})
    }
})


module.exports = router;