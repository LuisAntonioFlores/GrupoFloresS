// socket.js
const http = require('http');
const socketIo = require('socket.io');

let io;

function setupSocketServer(server) {
    io = socketIo(server, {
        cors: {
            origin: "https://www.grupofloress.com.mx/", // Cambia esto a la URL de tu cliente Angular
            // origin: "http://localhost:4200", // Cambia esto a la URL de tu cliente Angular
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type"],
            credentials: true
        }
    });
    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado');
      
        

        // Recibir el ID del cliente desde el frontend
        socket.on('joinRoom', (clientId) => {
            console.log(`Cliente con ID ${clientId} se unió al room ${clientId}`);
          socket.join(clientId); // El cliente se une a un room específico basado en su ID
         
        });

        
        socket.on('cartCleared', (data) => {
            const { clientId, success } = data;
            if (success) {
                console.log(`El carrito del cliente ${clientId} fue limpiado exitosamente.`);
                // Aquí puedes manejar el caso de éxito, como actualizar el estado de la base de datos si es necesario
            } else {
                console.log(`Hubo un problema al limpiar el carrito del cliente ${clientId}`);
            }
            
            // Detener el envío de más eventos al cliente después de la respuesta
            socket.removeAllListeners('clearCart');
        });

        // Escuchar evento 'clearCart' y emitirlo al cliente correspondiente
        socket.on('clearCart', (clientId) => {
            console.log(`Evento 'clearCart' recibido para cliente ${clientId}`);
            socket.to(clientId).emit('clearCart', { message: 'El pago fue aprobado, vacía el carrito.' });
            console.log(`Evento 'clearCart' emitido al cliente con ID: ${clientId}`);
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });

      });
      
    return io;
}

function getSocketInstance() {
    if (!io) {
        throw new Error('Socket.io no está configurado');
    }
    return io;
}

module.exports = { setupSocketServer, getSocketInstance };
