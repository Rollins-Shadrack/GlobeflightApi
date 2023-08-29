const mongoose = require('mongoose');

const EventsSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  creatorName: {
    type: String,
    required: true,
  },
  events: [
    {
      title: String,
      start: Date,
      end: Date,
    },
  ],
});

const Events = mongoose.model('Events', EventsSchema);

module.exports = Events;
