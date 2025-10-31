import api from "./api.service";
import socketService from "./socket.service";

const chatService = {
    // Fetch messages for a specific chat room
    fetchMessagesByRoomId: async (roomId) => {
        try {
            const { data } = await api.get(`/chat/rooms/${roomId}/messages`);
            return data;
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg);
        }
    },

    // Create or get existing chat room between trainer and trainee
    createOrGetChatRoom: async (trainerId, traineeId) => {
        try {
            const { data } = await api.post('/chat/create-room', {
                trainerId,
                traineeId
            });
            return data;
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg);
        }
    },

    // Send a message to a chat room
    sendMessage: async (roomId, senderId, message) => {
        try {
            const { data } = await api.post('/chat/send-message', {
                roomId,
                senderId,
                message
            });
            
            // Emit via socket with complete message data (already saved via API)
            // So socket just broadcasts it without saving again
            if (data.chatMessage) {
                socketService.sendMessage(
                    roomId,
                    senderId,
                    message,
                    data.chatMessage.id,
                    data.chatMessage.created_at
                );
            }
            
            return data;
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            throw new Error(msg);
        }
    }
};

export default chatService;