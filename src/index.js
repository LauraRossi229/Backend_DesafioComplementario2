import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import initializePassport from './config/passport.js'
import MongoStore from 'connect-mongo';
import http from 'http';
import { Server as socketIo } from 'socket.io';
import exphbs from 'express-handlebars';
import { fileURLToPath } from 'url'; // Importa fileURLToPath
import path from 'path'; 
import userRouter from './routes/users.routes.js';
import productRouter from './routes/products.routes.js';
import cartRouter from './routes/carts.routes.js';
import { messageRoutes } from './routes/messages.routes.js';
import { cartModel } from './models/carts.models.js';
import sessionRouter from './routes/session.routes.js';
import bodyParser from 'body-parser';



// Obtiene la ruta del directorio actual utilizando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const server = http.createServer(app);
const io = new socketIo(server);
// Configura body-parser para analizar las solicitudes POST
app.use(bodyParser.urlencoded({ extended: true }));

// Configura Handlebars como el motor de vistas
const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  partialsDir: path.join(__dirname, 'views/partials'),

});

// Registra la función 'hbs' como motor de vistas
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para limpiar la pantalla del navegador
app.use((req, res, next) => {
  if (req.query.clear === 'true') {
    // Redirige a la misma ruta sin el parámetro 'clear'
    return res.redirect(req.originalUrl.split('?')[0]);
  }
  next();
});

app.set('io', io);


// Configura el middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 8080;
const MONGO_URL = process.env.MONGO_URL;

// Conexión a la base de datos MongoDB
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('La base de datos se conectó con éxito');
  })
  .catch((error) => {
    console.error('Error en conexión a la BDD:', error);
  });

  //Middlewares
app.use(bodyParser.json());
app.use(cookieParser(process.env.SIGNED_COOKIE)) // La cookie esta firmada
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
            useNewUrlParser: true, //Establezco que la conexion sea mediante URL
            useUnifiedTopology: true //Manego de clusters de manera dinamica
        },
        ttl: 60 //Duracion de la sesion en la BDD en segundos

    }),
    secret: process.env.SESSION_SECRET,
    resave: false, //si esta en true Fuerzo a que se intente guardar a pesar de no tener modificacion en los datos
    saveUninitialized: false //si esta en true Fuerzo a guardar la session a pesar de no tener ningun dato
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});
    
    // Ahora que la conexión a la base de datos está establecida, puedes continuar con la configuración de las rutas y el servidor.
    app.use('/api/users', userRouter);
    app.use('/api/products', productRouter);
    app.use('/api/carts', cartRouter);
    app.use(messageRoutes);
    app.use('/', productRouter);
    app.use('/', cartRouter);
    app.use('/api/sessions', sessionRouter);
   

    
    
    io.on('connection', (socket) => {
      console.log('Un usuario se ha conectado al chat');

      socket.on('chat message', (message) => {
        console.log(`Mensaje recibido: ${message}`);
        io.emit('chat message', message);
      });

      socket.on('chat message response', function(response) {
        console.log('Respuesta del servidor:', response);
       io.emit('chat message response', 'Gracias, su mensaje fue enviado');
      });

      socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado del chat');
      });
    });

    // Ruta para la vista de chat
    app.get('/chat', (req, res) => {
      // Consulta todos los mensajes de la colección "messages"
  
      messageModel.find({}, (err, messages) => {
        if (err) {
          console.error(err);
        } else {
          // Renderiza la vista de chat y pasa los mensajes
          res.render('chat', { messages, messageSent: false });
        }
      });
    });

    // Ruta para manejar el envío del formulario y mostrar el mensaje de agradecimiento
    app.post('/chat', async (req, res) => {
      const { email, message } = req.body;

      try {
        // Guarda el mensaje en la colección "messages" de forma asíncrona
        const newMessage = new messageModel({ email, message });
        await newMessage.save();
        
        // Redirige de vuelta a la vista de chat con un parámetro para limpiar la pantalla
        res.redirect('/chat?clear=true');
      } catch (err) {
        console.error(err);
        res.status(500).send('Error al guardar el mensaje.');
      }
    });

    // Renderiza la vista HTML del carrito específico
cartRouter.get('/cart/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartModel
      .findById(cid)
      .populate('products.id_prod'); // Cambiado a 'products.id_prod'

    if (cart) {
      // Renderiza la vista 'cartSpecific.handlebars' con los datos del carrito
      res.render('cartSpecific', { cart }); // Asegúrate de tener acceso al objeto 'cart'
    } else {
      res.status(404).send({ respuesta: 'Error en consultar Carrito', mensaje: 'Not Found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el carrito específico.');
  }
});


   // Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});