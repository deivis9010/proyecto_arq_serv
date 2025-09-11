const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const emailRegex = /^\S+@\S+\.\S+$/;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Required field'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Required field'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [emailRegex, 'Invalid format']
  },
  password: {
    type: String,
    required: [true, 'Required field']
  },
  bio: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: null
  },
  active: {
    type: Boolean,
    default: false
  },
  tokenVersion: {
    type: Number,
    default: 0 // Se incrementa cuando queremos invalidar todos los tokens del usuario
  },
  lastPasswordChange: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // campos createdAt y updatedAt
  versionKey: false,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;      
      delete ret.password;
      delete ret.lastPasswordChange;
      delete ret.tokenVersion;
      
      // Generar URL completa para el avatar si existe
      if (ret.avatar) {
        ret.avatarUrl = `/api/uploads/avatars/${ret.avatar}`;
      }
      
      return ret;
    }
  },
  toObject: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      delete ret.lastPasswordChange;
      delete ret.tokenVersion;
      
      // Generar URL completa para el avatar si existe
      if (ret.avatar) {
        ret.avatarUrl = `/api/uploads/avatars/${ret.avatar}`;
      }
      
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
    if (!this.isModified('password')) return next();
    
    // Actualizar el timestamp de cambio de contraseña
    this.lastPasswordChange = new Date();
    
    // Incrementar la versión del token para invalidar tokens anteriores
    this.tokenVersion += 1;
    
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
