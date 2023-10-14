import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  email: {
    type: String, // Asegúrate de que el tipo sea correcto (String en este caso)
   required: true, // Marca el campo como requerido
  },
  message: {
    type: String, // Asegúrate de que el tipo sea correcto (String en este caso)
    required: true, // Marca el campo como requerido
  },
});

const messageModel = mongoose.model('Message', messageSchema);

export { messageModel };
