const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, 'email is required']
  },
  password: {
    type: String,
    required: [true, 'password is required']
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  role: {
    type: String,
    enum: ['PATIENT', 'THERAPIST', 'ADMIN', 'ONBOARDING', 'INACTIVE'],
    default: 'PATIENT'
  },
  patients: [{
    type: Schema.Types.ObjectId, ref: 'User',
    default: null
  }],
  coachID: {
    type: Schema.Types.ObjectId, ref: 'User',
    default: null
  },
  employer: {
    type: Schema.Types.ObjectId, ref: 'Company',
    default: null
  },
  createdById: {
    type: Schema.Types.ObjectId, ref: 'User',
    default: null
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  // stripe: {
  //   customer: { type: String },
  //   setup_intent: { type: String },
  //   checkout_session_id: {type: String},
  //   // payment_method: { type: String },
  //   // lastFour: { type: String },
  //   // plan: { type: String },
  //   // activeUntil: { type: Date }
  // },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
},
  { timestamps: true });


//= ===============================
// User ORM Methods
//= ===============================

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function (next) {
  const user = this,
    SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
