const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const EmployeeSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, // Ensure the username is unique
  },
  name: { 
    type: String, 
    required: true 
  },
  age: { 
    type: Number, 
    required: true 
  },
  class: { 
    type: String, 
    required: true 
  },
  subjects: [String],
  attendance: { 
    type: Number, 
    default: 0 
  },
  role: { 
    type: String, 
    enum: ['admin', 'employee'], 
    required: true 
  },
  password: { 
    type: String, 
    required: true // New password field
  },
});

// Pre-save hook to hash password before saving to the database
EmployeeSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Method to compare provided password with the stored hashed password
EmployeeSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Employee', EmployeeSchema);
