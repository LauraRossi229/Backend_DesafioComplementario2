$(document).ready(function() {

  const socket = io();
console.log('Conexión establecida con el servidor de Socket.io');


  // Manejar el envío de mensajes
  $('#message-form').submit(function(event) {
    event.preventDefault(); // Evita que se envíe el formulario de manera predeterminada
    const message = $('#message-input').val();

    // Emitir el mensaje al servidor
  console.log('Mensaje enviado al servidor:', message);
  socket.emit('chat message', message);

    // Limpiar el campo de entrada
    $('#message-input').val('');

    // Borrar el contenido del chat
    $('#chat-box').empty();

    // Manejar la respuesta del servidor
    socket.on('chat message response', function(response) {
      // Agregar la respuesta del servidor al chat-box
      $('#chat-box').append($('<p>').text(response));
      
      
    });

    return false;
  });

  // Manejar la recepción de mensajes
  socket.on('chat message', function(message) {
    $('#chat-box').append($('<p>').text(message));
  });
 
});
