// socket.js
const http = require('http');
const socketIo = require('socket.io');

let io;

function setupSocketServer(server) {
    io = socketIo(server, {
        cors: {
            origin: "http://localhost:4200", // Cambia esto a la URL de tu cliente Angular
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type"],
            credentials: true
        }
    });
    io.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id);

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
        
        // Aquí puedes escuchar eventos específicos
        // socket.on('evento', (data) => { ... });
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
