const {Socket} = require('socket.io');
const {comprobarJWT} = require('../helpers/generar-jwt');
const { chatMensajes } = require('../models');

const ChatMensajes = new chatMensajes();

const socketController = async(socket=new Socket(),io)=>
{
    const token =socket.handshake.headers['x-token'];
    const usuario = await comprobarJWT(token);

    if(!usuario)
    {
        return socket.disconnect();
    }

    //agregar el usuario conectado
    ChatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos',ChatMensajes.usuariosArr);
    socket.emit('recibir-mensaje',ChatMensajes.ultimos10);

    //conectarlo a una sala especial
    socket.join(usuario.id);

    //Limpiar sing out
    socket.on('disconnect',()=>
    {
        ChatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos',ChatMensajes.usuariosArr);
    })

    socket.on('enviar-mensaje',({uid,mensaje})=>{
        if(uid)
        {
            socket.to(uid).emit('mensaje-privado',{de:usuario.nombre,mensaje});
        }
        else
        {
        ChatMensajes.enviarMensaje(usuario.uid,usuario.nombre,mensaje);
        io.emit('recibir-mensaje',ChatMensajes.ultimos10);
        }
    })

}

module.exports = {socketController}