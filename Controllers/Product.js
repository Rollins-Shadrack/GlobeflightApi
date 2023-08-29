const path = require('path');
const fs = require('fs')
const asyncHandler = require('express-async-handler')
const Product = require('../models/Product')

const Upload = asyncHandler(async (req, res) => {
    const uploadedFiles = [];
    // Check if files are present in the request
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace(/uploads\\/g, ''));
      }
    } else {
      // Handle the case where no files are uploaded
      return res.status(400).json({ message: 'No files uploaded' });
    }
  
    res.status(200).json(uploadedFiles[0]);
  })

  const NewProduct = asyncHandler(async (req, res) => {
    const { image, title, description, category, stock, price, expense } = req.body;
  
    try {
      const product = await Product.create({
        image,
        title,
        description,
        category,
        stock,
        price,
        expense,
      });
  
      if (product) {
        res.status(201).json({ message: 'Product created successfully' });
      } else {
        res.status(401);
        throw new Error('Unable to create Product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

module.exports ={
    Upload,
    NewProduct
}