const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } // Adjust for production security
});

// Object to map custom User IDs to active Socket IDs
// Example structure: { "user_123": "socket_ABC789xyz" }
const connectedUsers = {};

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // 1. REGISTER USER: Triggered when a client logs in/identifies themselves
    socket.on('register_user', (userId) => {
        connectedUsers[userId] = socket.id;
        console.log(`User registered: Custom ID "${userId}" mapped to Socket "${socket.id}"`);
    });

    // 2. PRIVATE MESSAGING: Listen for a message targeted at a specific user
    socket.on('private_message', (data) => {
        const { targetUserId, message, senderId } = data;
        
        // Find the active socket ID of the recipient
        const recipientSocketId = connectedUsers[targetUserId];

        if (recipientSocketId) {
            // Send the payload strictly to the recipient's target socket channel
            io.to(recipientSocketId).emit('receive_private_message', {
                senderId: senderId,
                message: message
            });
            console.log(`Message sent from ${senderId} to ${targetUserId}`);
        } else {
            // Fallback error event if the destination user is offline
            socket.emit('error_message', { error: `User ${targetUserId} is offline.` });
        }
    });

    // 3. CLEANUP: Clear mappings when a connection terminates
    socket.on('disconnect', () => {
        // Find and delete the key belonging to the disconnected socket
        for (const userId in connectedUsers) {
            if (connectedUsers[userId] === socket.id) {
                delete connectedUsers[userId];
                console.log(`User ${userId} disconnected. Cleared tracking.`);
                break;
            }
        }
    });
});

// Run server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Socket.io server running on http://localhost:${PORT}`);
});
