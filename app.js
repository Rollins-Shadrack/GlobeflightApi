const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')
const dotenv = require('dotenv')
const app = express()
const {notFound, errorHandler} = require('./middleware/errorMiddleware')
const path = require('path');
const fs = require('fs');


const Product = require('./models/Product')
const Notification = require('./models/Notifications')
const Message = require('./models/Message');

// Configurations

dotenv.config()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}))
app.use(morgan("common"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())
app.use(
    cors({
      origin: ['http://localhost:3000', 'https://globeflight-dashboard.netlify.app'],
      credentials: true, 
    })
  );
app.use('/uploads', express.static(__dirname+'/uploads'))





//Routes
app.use('/product', require('./routes/products'))
app.use('/service', require('./routes/services'))
app.use('/users', require('./routes/user'))
app.use('/demo', require('./routes/demo'))


app.use(notFound)
app.use(errorHandler)

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://globeflight-dashboard.netlify.app'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const getLastNotification = async(department) =>{
  let departmentNotification = await Notification.aggregate([
    {$match: {department: department}},
    {$group: {_id: '$date', notificationByDate: {$push: '$$ROOT'}}}
  ])

  return departmentNotification
}

const getLastMessagesFromRoom = async(room) =>{
  let roomMessages = await Message.aggregate([
    {$match: {to: room}},
    {$group: {_id: '$date', messagesByDate: {$push: '$$ROOT'}}}
  ])
  return roomMessages
}

//SOrt notification by date
const sortNotificationByDate = (notifications) =>{
  return notifications.sort((a,b) =>{
    let date1 = a._id.split('/');
    let date2 = b._id.split('/');

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1
  })
}



io.on('connection', (socket) => {

  //Maintaining a record of all the active rooms
  const activeRooms = new Map();

  //Joining Room
  socket.on('join-room', async(newRoom, previousRoom) =>{
    socket.join(newRoom)
    socket.leave(previousRoom);

    let roomMessages = await getLastMessagesFromRoom(newRoom)
    roomMessages = sortNotificationByDate(roomMessages)

    //send it back to client
    socket.emit('room-messages', roomMessages)
  })

  //leaving  a room
  socket.on('leave-room', () => {
    const room = activeRooms.get(socket.id);
    socket.leave(room);
    activeRooms.delete(socket.id);
  });

  //messages
  socket.on('message-room', async(room, content, sender, time, date)=>{
    // console.log(room, content, sender, time, date )
   // await Message.deleteMany({});
    await Message.create({content, from:sender, time, date, to:room});
    let roomMessages = await getLastMessagesFromRoom(room)
    roomMessages = sortNotificationByDate(roomMessages)

    //send messages to the room
    io.to(room).emit('room-messages', roomMessages)

    socket.broadcast.emit('notifications', room)

    for (const [socketId, activeRoom] of activeRooms.entries()) {
      if (activeRoom !== room) {
        io.to(socketId).emit('notifications', room);
      }
    }
  })



  socket.on('show_notifications', async(department) =>{
    let notifications = await getLastNotification(department)
    notifications = sortNotificationByDate(notifications)

    //send the data to the frontend
    socket.emit('notificationMessages', notifications)
  })
  socket.on('notification', async(message, user,time, date, department) =>{
    await Notification.create({message, from: user, time, date, department});
   let departmentNotification = await getLastNotification(department)
   departmentNotification = sortNotificationByDate(departmentNotification)

   //send notification to respective department
   io.emit('notificationMessages', departmentNotification)

   console.log(departmentNotification)


   //users who are not online should receive a notification
   socket.broadcast.emit('notifications', department)
  })
});


const PORT  = process.env.PORT || 8000;


mongoose.connect(process.env.MONGO_URL).then(async()=>{
  server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    //Adding a seed data to the database
    // await mongoose.connection.db.dropDatabase()
    // KPI.insertMany(kpis)
    // Product.insertMany(products)
    // Transaction.insertMany(transactions)
}).catch((error) =>
console.log(`${error} did not connect`))
