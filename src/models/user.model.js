const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const emailRegex = /^\S+@\S+\.\S+$/;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [emailRegex, 'Formato de email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida']
  },
  bio: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true, // campos createdAt y updatedAt
  versionKey: false,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      // Nunca exponer la contraseña
      delete ret.password;
      return ret;
    }
  },
  toObject: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  }
});

// Índice único en email
userSchema.index({ email: 1 }, { unique: true });

// Rondas de salt configurables vía env, por defecto 10
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;

// Hook pre-save: hashea la contraseña cuando es nueva o ha sido modificada
userSchema.pre('save', async function (next) {
  try {
    console.log('Pre-save hook: hashing password if modified');
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

// Método de instancia para comparar una contraseña candidata con el hash almacenado
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Exportar modelo
const User = mongoose.model('User', userSchema);
module.exports = User;
