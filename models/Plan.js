const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlanSchema = new Schema({
  createdBy:{
    type:Object
},
  inputFields: [
    {
      value: String,
    },
  ],
  description: { type: String, required: true },
  title: { type: String, required: true },
  manager: { type: String, required: true },
  planManager:{type:String, required:true},
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  priority: { type: Number, required: true },
  budget: {type: Number  },
  status: { type: String, default: 'Incomplete' },
  report: [{ type: String,}],
},{timestamps: true});

const Plan = mongoose.model('Plan', PlanSchema);

module.exports = Plan;
