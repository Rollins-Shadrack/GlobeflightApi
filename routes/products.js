const express = require('express')
const Product = require('../models/Product')
const {Upload, NewProduct} = require('../Controllers/Product')
const multer = require('multer')
const {protect} = require('../middleware/authMiddleware')


const router = express.Router();

router.get('/products',protect, async(req,res) =>{
    try{
        const products = await Product.find().sort({ createdAt: -1 }).limit(5);
        res.status(200).json(products)

    }catch(error){
        res.status(404).json({message: error.message})
    }
})
router.post('/new-product',protect, NewProduct)

const photosMiddleware = multer({ dest: './uploads' });
router.post('/image', protect, photosMiddleware.array('photo', 5), Upload);


module.exports = router;