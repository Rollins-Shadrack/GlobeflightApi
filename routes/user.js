const express = require('express')
const {authUser,registerUser,logoutUser,getUserprofile,UpdateUserprofile, applyLeave, groupDataByDepartment, AllUsers, deleteUser, newPlan, AllPlans, SinglePlan, UpdatePlan, addDriver, AllDrivers, deleteDriver, deletePlan, updateDocument, addEvent, getEvent, getLeave, approveLeave}  = require('../Controllers/users')
const {protect} = require('../middleware/authMiddleware')
const multer = require('multer')
const path = require('path')
const crypto = require('crypto');

const router = express.Router();

router.post('/register',protect,registerUser)
router.post('/auth',authUser)
router.post('/logout',logoutUser)
router.route('/leave').post(protect, applyLeave).get(protect, getLeave)
router.get('/department', protect, groupDataByDepartment)
router.get('/all', protect, AllUsers)
router.post('/delete', protect, deleteUser)
router.route('/profile').get(protect,getUserprofile).put(protect,UpdateUserprofile)
router.route('/plans').post( protect,newPlan).get(protect,AllPlans).put(protect,UpdatePlan)
router.get('/plans/:id',protect,SinglePlan)
router.post('/delete_plan', protect,deletePlan)
router.route('/driver').post( protect,addDriver).get(protect,AllDrivers)
router.post('/remove_driver', protect, deleteDriver)
router.route('/events').post( protect,addEvent).get(protect,getEvent)
router.post('/approve_leave', protect,approveLeave)

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

module.exports = router;