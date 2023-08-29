const asyncHandler = require('express-async-handler')
const User = require('../models/Users')
const {generateToken} = require('../utils/generateToken');
const LeaveApplication = require('../models/LeaveApplication');
const Plan = require('../models/Plan');
const Driver = require('../models/Drivers');
const Events = require('../models/Events');


const authUser = asyncHandler(async(req,res) =>{
    const {email,password} = req.body

    const user = await User.findOne({email})

    if(user && (await user.matchPasswords(password))){
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.username,
            email: user.email,
            fname: user.fname,
            lname: user.lname,
            address: user.address,
            mobile: user.mobile,
            emergency: user.emergency,
            employeeId: user.employeeId,
            jobtitle: user.jobtitle,
            image: user.image,
            department: user.department,
            salesTarget: user.salesTarget,
        })
    }else{
        res.status(401)
        throw new Error ('Invalid Email or password')
    }

});


const registerUser = asyncHandler(async(req,res) =>{
    const {username, department, email,password} = req.body

    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error("User already exists")
    }

    const user = await User.create({
        username, department, email,password
    })

    if(user){
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.username,
            email: user.email,
            department: user.department,
            fname: user.fname,
            lname: user.lname,
            address: user.address,
            mobile: user.mobile,
            emergency: user.emergency,
            employeeId: user.employeeId,
            jobtitle: user.jobtitle,
            image: user.image,
            department: user.department,
            salesTarget: user.salesTarget,
            message:"Account Created Successfully"
        })
    }else{
        res.status(400)
        throw new Error ('Invalid user data')
    }

});

const logoutUser = asyncHandler(async(req,res) =>{
    res.cookie('jwt','',{
        httpOnly:true,
        expires: new Date(0)
    })
    res.status(200).json({message:"Logged Out"})

});

const getUserprofile = asyncHandler(async(req,res) =>{
    const user = {
        _id: user._id,
        name: user.username,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
        address: user.address,
        mobile: user.mobile,
        emergency: user.emergency,
        employeeId: user.employeeId,
        jobtitle: user.jobtitle,
        image: user.image,
        department: user.department,
        salesTarget: user.salesTarget,
    }
    res.status(200).json(user)

});

const UpdateUserprofile = asyncHandler(async(req,res) =>{
  const user = await User.findById(req.user._id)

  if(user){
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.fname = req.body.fname || user.fname;
    user.lname = req.body.lname || user.lname;
    user.address = req.body.address || user.address;
    user.mobile = req.body.mobile || user.mobile;
    user.emergency = req.body.emergency || user.emergency;
    user.employeeId = req.body.employeeId || user.employeeId;
    user.jobtitle = req.body.jobtitle || user.jobtitle;
    user.image = req.body.image || user.image;
    user.salesTarget =req.body.salesTarget || user.salesTarget;

    if(req.body.password){
        user.password = req.body.password
    }

    const updatedUser = await user.save()
    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.username,
        email: updatedUser.email,
        fname: updatedUser.fname,
        lname: updatedUser.lname,
        address: updatedUser.address,
        mobile: updatedUser.mobile,
        emergency: updatedUser.emergency,
        employeeId: updatedUser.employeeId,
        jobtitle: updatedUser.jobtitle,
        image: updatedUser.image,
        department: updatedUser.department,
        salesTarget: updatedUser.salesTarget,
        message: 'Profile Updated Successfullly'
    })

  }else{
    res.status(404);
    throw new Error('User not Found')
  }

});

const applyLeave = asyncHandler( async(req, res) =>{
    const {appliedBy,leaveType, startDate, endDate, reason} = req.body

    //format the dates:
    const formattedStartDate = new Date(startDate)
    const formattedEndDate = new Date(endDate)

    try{
        const leave = await LeaveApplication.create({
            appliedBy, leaveType, startDate:formattedStartDate, endDate:formattedEndDate, reason
        })

        if(leave){
            res.status(201).json({ message: 'Leave Application Sent' });
        }else{
            res.status(401);
            throw new Error('Unable to submit your application');
        }

    }catch (error) {
      console.error('Error creating a service:', error);
      throw new Error('Internal Server error')
    }
})

let groupDataByDepartment = asyncHandler( async(req,res) =>{
    const department = await User.distinct("department")

    if(department){

        department.unshift("General")

        res.status(200).json(department)

    }else{
        throw new Error('Unable to collect The departments')
    }
})

const AllUsers = asyncHandler(async(req,res) =>{
    try{
        const users = await User.find().sort({ createdAt: -1 })
        res.status(200).json(users)
    
    }catch(error){
        res.status(404).json({message: error.message})
    }
})
const deleteUser = asyncHandler(async(req,res) =>{
   let deleted =  await User.deleteOne({_id: req.body.id})
   if(deleted){
    res.status(200).json({message:'Employee Removed'})
   }
   throw new Error('Unable to Remove Employee')
})

const newPlan = asyncHandler(async(req,res) =>{
    try {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);
        const newPlan = await Plan.create({
            ...req.body,
            startDate,
            endDate,
          });
        res.status(201).json({message:"Plan Created Successfully"});
      } catch (error) {
        res.status(500)
        console.log(error.message)
        throw new Error('Unable to Create Plan')
      }
})

const AllPlans = asyncHandler(async(req,res) =>{
    try{
        const plans = await Plan.find().sort({ createdAt: -1 })
        res.status(200).json(plans)
    
    }catch(error){
        res.status(404).json({message: error.message})
    }
})

const SinglePlan = asyncHandler(async(req,res) =>{
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan) {
          res.status(404);
          throw new Error('Plan not Found');
        }
        res.status(200).json(plan)
        
      } catch (error) {
        res.status(500);
        throw new Error('Server error');
      }

})

const UpdatePlan = asyncHandler(async(req,res) =>{
    const plan = await Plan.findById(req.body.updateId)
    if(plan){
        plan.inputFields = req.body.inputFields || plan.inputFields
        plan.description = req.body.description || plan.description
        plan.title = req.body.title || plan.title
        plan.manager = req.body.manager || plan.manager
        plan.priority = req.body.priority || plan.priority
        plan.budget = req.body.budget || plan.budget
        plan.status = req.body.status || plan.status

        if(req.body.startDate){
            plan.startDate = new Date(req.body.startDate)
        }
        if(req.body.endDate){
            plan.endDate = new Date(req.body.endDate)
        }

    }
    if(req.body.status){
        await plan.save()
        res.status(200).json({message:'Plan Status Changed'})
    }else{
        await plan.save()
  res.status(200).json({message:'Plan Updated Successfully'})
    }
})
const addDriver = asyncHandler(async(req,res) =>{

    try{
        const expire = new Date(req.body.expire)

        await Driver.create({
            ...req.body,
            expire
        })
        res.status(201).json({message:"Driver Successfully Added"});

    }catch (error) {
        res.status(500)
        console.log(error.message)
        throw new Error('Unable to Add Driver')
      }
})

const AllDrivers = asyncHandler(async(req,res) =>{
    try{
        const drivers = await Driver.find().sort({ createdAt: -1 })
        res.status(200).json(drivers)
    
    }catch(error){
        res.status(404).json({message: error.message})
    }
})
const deleteDriver = asyncHandler(async(req, res) =>{
    let deleted =  await Driver.deleteOne({_id: req.body.id})
   if(deleted){
    res.status(200).json({message:'Driver Removed'})
   }
   throw new Error('Unable to Remove Driver')
})

const deletePlan = asyncHandler(async(req,res) =>{
    let deleted =  await Plan.deleteOne({_id: req.body.id})
   if(deleted){
    res.status(200).json({message:'Plan Removed'})
   }
   throw new Error('Unable to Remove Plan')
})

const updateDocument = asyncHandler(async(req,res) =>{
    const id = req.body.id
    const uploadedFile = req.files[0];
    const originalFileName = uploadedFile.originalname;

    let plan = await Plan.findById(id);

    if(plan){
        plan.report.push(originalFileName)
        plan.status = 'Complete'
        plan = await plan.save()
        res.status(200).json({message:"Report Saved"})
    }
})

const addEvent = asyncHandler(async(req,res) =>{
    const { creatorId, creatorName, newEvent } = req.body;

  try {
    let creatorEvents = await Events.findOne({ creatorId });

    if (!creatorEvents) {
      creatorEvents = new Events({
        creatorId,
        creatorName,
        events: [newEvent],
      });
    } else {
      creatorEvents.events.push(newEvent);
    }

    await creatorEvents.save();
    res.status(200).json({ message: 'Event added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding the event' });
  }
})

const getEvent = asyncHandler(async(req,res) =>{
    try{
        const events = await Events.find().sort({ createdAt: -1 })
        res.status(200).json(events)
    
    }catch(error){
        res.status(404).json({message: error.message})
    }
})


const getLeave = asyncHandler(async(req,res) =>{
    try{
        const leave = await LeaveApplication.find().sort({ createdAt: -1 }).populate('appliedBy', '-password');
        res.status(200).json(leave)
    
    }catch(error){
        res.status(404).json({message: error.message})
    }
})

const approveLeave = asyncHandler(async (req, res) => {
    try {
      let leave = await LeaveApplication.findById(req.body.id);
      if (leave) {
        leave.status = 'Approved';
        leave = await leave.save();
        res.status(200).json({ message: "Leave Approved" });
      } else {
        res.status(404).json({ message: "Leave not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
module.exports ={
    authUser,
    registerUser,
    logoutUser,
    getUserprofile,
    UpdateUserprofile,
    applyLeave,
    groupDataByDepartment,
    AllUsers,
    deleteUser,
    newPlan,
    AllPlans,
    SinglePlan,
    UpdatePlan,
    addDriver,
    AllDrivers,
    deleteDriver,
    deletePlan,
    updateDocument,
    addEvent,
    getEvent,
    getLeave,
    approveLeave
}