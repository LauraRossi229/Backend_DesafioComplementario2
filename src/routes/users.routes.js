import { Router } from "express";
import { userModel } from "../models/users.models.js";


const userRouter = Router()

userRouter.get('/', async (req, res) => {
    try {
        const users = await userModel.find()
        res.status(200).send({ respuesta: 'OK', mensaje: users })
        //res.render('users', { users }); // Renderiza la vista con la lista de usuarios
    } catch (error) {
        res.status(500).render('users', { errorMessage: 'Error en consultar usuarios' });
    }
})

userRouter.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id)
        if (user) {
            res.status(200).send({ respuesta: 'OK', mensaje: user })
            //res.render('users', { user }); Renderiza el formulario de edición de usuario
            
        } else {
            res.status(404).send({ respuesta: 'Error en consultar usuario', mensaje: 'User not Found' })
            //res.status(404).render('users', { errorMessage: 'Usuario no encontrado', users: [] });
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consultar usuario', mensaje: error })
        //res.status(500).render('users', { errorMessage: 'Error en consultar usuario', users: [] });
    }
})
userRouter.put('/:id', async (req, res) => {
    const { id } = req.params
    const { first_name, last_name, age, email, password } = req.body
    try {
        const user = await userModel.findByIdAndUpdate(id, { first_name, last_name, age, email, password })
        if (user) {
           res.status(200).send({ respuesta: 'OK', mensaje: user })
           //res.render('users', { successMessage: 'Usuario actualizado con éxito', users: [] }); Mostrar mensaje de éxito

        } else {
            res.status(404).send({ respuesta: 'Error en actualizar usuario', mensaje: 'User not Found' })
            //res.status(404).render('users', { errorMessage: 'Usuario no encontrado', users: [] });
        
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en actualizar usuario', mensaje: error })
        //res.status(500).render('users', { errorMessage: 'Error en actualizar usuario', users: [] });  Mostrar mensaje de error
    }
})

userRouter.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findByIdAndDelete(id)
        if (user) {
            res.status(200).send({ respuesta: 'OK', mensaje: user })
            //res.render('users', { successMessage: 'Usuario eliminado con éxito', users: [] }); // Mostrar mensaje de éxito
        } else {
            res.status(404).send({ respuesta: 'Error en eliminar usuario', mensaje: 'User not Found' })
            //res.status(404).render('users', { errorMessage: 'Usuario no encontrado', users: [] });
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en eliminar usuario', mensaje: error })
        //res.status(500).render('users', { errorMessage: 'Error en eliminar usuario', users: [] }); // Mostrar mensaje de error
    }
})

export default userRouter