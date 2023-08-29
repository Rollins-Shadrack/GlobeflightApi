const express = require('express')
const {newService, allService,singleService, updateService, sendQuote, updateDocument, deleteOrAbortQuote, ExchangeRatesFunction,getExchangeRates, ChangeProgress, AddInventory, getInventories, getSingleInventory, updateInventory, assignDriver}  = require('../Controllers/service')
const {protect} = require('../middleware/authMiddleware')
const multer = require('multer')
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');


const router = express.Router();

router.post('/new', protect ,newService)

router.get('/orders',protect ,allService)

router.get('/orders/:id',protect ,singleService)

router.route('/orders').put(protect,updateService)

router.post('/delete', protect, deleteOrAbortQuote)

router.route('/inventory').post(protect, AddInventory).get(protect, getInventories).put(protect, updateInventory)

router.get('/inventory/:id', protect, getSingleInventory)

router.route('/exchange').post(protect, ExchangeRatesFunction).get(protect,getExchangeRates)

router.post('/progress', protect, ChangeProgress)

const storage = multer.memoryStorage(); // Store the file in memory

const fileFilter = async (req, file, cb) => {
    if (req.body.documentName === 'Quotation') {
      const filePath = path.join('./uploads', file.originalname);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); 
        cb(null, true);
      } else {
        cb(null, true);
      }
    } else {
      cb(null, true); // Allow upload for other document types
    }
  };
  
  const photosMiddleware = multer({
    storage: multer.diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
  
        // Generate a random filename
        const randomBytes = crypto.randomBytes(16);
        const randomFilename = `${randomBytes.toString('hex')}${path.extname(file.originalname)}`;
        
        cb(null, randomFilename);
      }
    }),
  });
  
  
  
  router.post('/document', protect, photosMiddleware.array('document', 5), updateDocument);

  router.post('/assign_driver', protect,assignDriver)
  


module.exports = router;