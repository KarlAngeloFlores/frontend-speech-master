import io from 'socket.io-client';

let socket = null;


const socketService = {
    // Initialize socket connection
    connect: () => {
        if (!socket) {
            const socketUrl = 'https://your-render-backend-url.onrender.com' || 'http://localhost:5000';
            socket = io(socketUrl, {
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 10,
            });

            socket.on('connect', () => {
                console.log('Socket connected:', socket.id);
            });

            socket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            socket.on('error', (error) => {
                console.error('Socket error:', error);
            });
        }
        return socket;
    },

    // Join a chat room
    joinRoom: (roomId) => {
        if (socket) {
            socket.emit('joinRoom', roomId);
            console.log(`Joined room: ${roomId}`);
        }
    },

    // Send a message through socket
    sendMessage: (roomId, senderId, message, messageId, created_at) => {
        if (socket) {
            socket.emit('sendMessage', { roomId, senderId, message, messageId, created_at });
        }
    },

    // Listen for new messages
    onNewMessage: (callback) => {
        if (socket) {
            socket.on('newMessage', callback);
        }
    },

    // Remove message listener
    offNewMessage: () => {
        if (socket) {
            socket.off('newMessage');
        }
    },

    // Disconnect socket
    disconnect: () => {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
    },

    // Get socket instance
    getSocket: () => socket
};

export default socketService;
