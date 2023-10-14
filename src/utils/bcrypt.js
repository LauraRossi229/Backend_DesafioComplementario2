import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// Obtén el número de rondas desde la variable de entorno
const saltRounds = parseInt(process.env.SALT);

export const createHash = (password) => {
  // Verifica que la contraseña sea una cadena de texto válida
  if (typeof password !== 'string') {
    throw new Error('La contraseña debe ser una cadena de texto válida.');
  }

  // Genera un "salt" utilizando el número de rondas especificado
  const salt = bcrypt.genSaltSync(saltRounds);

  // Crea el hash de la contraseña
  const hash = bcrypt.hashSync(password, salt);

  return hash;
};

export const validatePassword = (passwordSend, passwordBDD) => bcrypt.compareSync(passwordSend, passwordBDD);
