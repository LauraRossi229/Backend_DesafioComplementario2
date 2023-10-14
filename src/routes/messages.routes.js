
import { Router } from "express";
import {messageModel} from '../models/messages.models.js';


const messageRouter = Router()

// Ruta para la vista del chat
messageRouter.get('/chat', async (req, res) => {
  try {
    // Consulta todos los mensajes de la colección "messages"
    const messages = await messageModel.find().exec();

    // Renderiza la vista de chat y pasa los mensajes
    res.render('chat', { messages });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar los mensajes del chat.');
  }
});

// Ruta para enviar un nuevo mensaje
messageRouter.post('/chat', async (req, res) => {
  const { email, message } = req.body;

  try {
    // Guardar el mensaje en la colección "messages" de forma asíncrona
    const newMessage = new messageModel({ email, message });
    await newMessage.save();

    console.log('Mensaje guardado en la base de datos');

    // Emitir un evento de respuesta al cliente
    req.app.get('io').emit('chat message response', 'Gracias, su mensaje fue enviado');
    console.log('Evento de respuesta emitido desde el servidor');

    res.sendStatus(200); // Enviar una respuesta de éxito al cliente
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al guardar el mensaje.');
  }
});




export { messageRouter as messageRoutes };

