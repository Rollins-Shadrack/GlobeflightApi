const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    message: String,
    from: Object,
    socketid: String,
    time: String,
    date: String,
    department: String
})

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification