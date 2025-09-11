const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema del modelo Post
const postSchema = new Schema({
    // ID automático generado por MongoDB como string
    _id: {
        type: Schema.Types.ObjectId,
        auto: true
    },
    
    // Título del post - requerido, mínimo 5 caracteres
    title: {
        type: String,
        required: [true, 'Required field'],
        minlength: [5, 'Minimum length required'],
        trim: true
    },
    
    // Texto del post - requerido, mínimo 5 caracteres
    text: {
        type: String,
        required: [true, 'Required field'],
        minlength: [5, 'Minimum length required'],
        trim: true
    },
    
    // Autor del post - requerido
    author: {
        type: String,
        required: [true, 'Required field'],
        trim: true
    }
    
}, {
    // Opciones del schema
    timestamps: true,  // Añade automáticamente createdAt y updatedAt
    versionKey: false, // Elimina el campo __v
    
    // Transformar el objeto al convertir a JSON
    toJSON: {
        transform: function(doc, ret) {
            // Convertir _id a id como string
            ret.id = ret._id.toString();
            delete ret._id;
            return ret;
        }
    },
    
    // Transformar el objeto al convertir a Object
    toObject: {
        transform: function(doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            return ret;
        }
    }
});







// Crear y exportar el modelo
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
