import mongoose from 'mongoose';

const SocUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  category: { type: String, required: true },
  name: { type: String, required: true },
  otp: { type: String, default: null },
  otpVerified: { type: Boolean, default: false }
});

const AdminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, default: null },
  otpVerified: { type: Boolean, default: false }
});

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date },
  time: { type: String },
  venue: { type: String },
  status: { type: String, default: 'Active' },
  activityPoints: { type: Boolean },
  rate: { type: Number },
  registrationLink: { type: String },
  
  OwnerModel: { 
    type: String, 
    required: true,
    enum: ['Soc_User', 'Admin_User'] 
  },

  OwnerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    refPath: 'OwnerModel'
  }
});

const EventDetailsSchema = new mongoose.Schema({
  a_desc: { type: String },
  p_desc: { type: String },
  poster: {
    data: Buffer,
    contentType: String,
    fileName: String
  },

  images: [{
      data: Buffer,
      contentType: String,
      fileName: String
  }],

  EventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
});

const Soc_User = mongoose.model('Soc_User', SocUserSchema);
const Admin_User = mongoose.model('Admin_User', AdminUserSchema);
const Event = mongoose.model('Event', EventSchema);
const Event_Details = mongoose.model('Event_Details', EventDetailsSchema);

export { Soc_User, Admin_User, Event, Event_Details };