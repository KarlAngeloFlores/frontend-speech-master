import React, { useState, useEffect } from 'react';
import SidebarTrainer from '../../components/SidebarTrainer';
import { Logout } from '../../components/auth/Logout';
import trainerService from '../../services/trainer.service';
import chatService from '../../services/chat.service';
import socketService from '../../services/socket.service';
import TraineeList from './chat/TraineeList';
import ChatArea from './chat/ChatArea';
import authService from '../../services/auth.service';
import EmptyState from './chat/EmptyState';
import { Menu } from 'lucide-react';


const TrainerMessagePage = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [listOpen, setListOpen] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingConvo, setLoadingConvo] = useState(false);
    const [selectedTrainee, setSelectedTrainee] = useState(null);
    const [selectedTraineeData, setSelectedTraineeData] = useState(null);
    const [trainees, setTrainees] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    // Get current user ID from localStorage or auth context

    const fetchCurrentUser = async () => {
        try {
            const user = await authService.me();
            console.log('Current user:', user);
            setCurrentUserId(user.id);
            // Connect to socket after getting user ID
            socketService.connect();
        } catch (err) {
            console.error('Failed to fetch current user:', err);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const handleOpenSidebars = () => {
        setMobileOpen(true);
        setListOpen(true);
    }

    const handleBackClick = () => {
        setSelectedTrainee(null);
        setSelectedTraineeData(null);
        setMessages([]);
    }

    //working
    const fetchTrainees = async () => {
        setLoading(true);
        try {
            const response = await trainerService.getTrainees();
            const verifiedTrainees = response.data.filter(trainee => trainee.status === 'verified');
            setTrainees(verifiedTrainees);
        } catch (err) {
            setError('Failed to fetch trainees');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    //not tested
    const fetchMessages = async (roomId) => {
        try {
            const response = await chatService.fetchMessagesByRoomId(roomId);
            const formattedMessages = response.messages.map(msg => ({
                id: msg.id,
                sender: msg.sender_id === currentUserId ? 'trainer' : 'trainee',
                text: msg.message,
                time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                senderId: msg.sender_id
            }));
            setMessages(formattedMessages);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
            setMessages([]);
        }
    };

    const handleSelectTrainee = async (traineeName, traineeData) => {
        setSelectedTrainee(traineeData.email);
        setSelectedTraineeData(traineeData);
        setLoadingConvo(true);

        try {
            // Remove old listener before adding new one
            socketService.offNewMessage();

            // Create or get existing chat room
            const roomResponse = await chatService.createOrGetChatRoom(currentUserId, traineeData.id);
            const roomId = roomResponse.chatRoom ? roomResponse.chatRoom.id : roomResponse.id;
            setCurrentRoomId(roomId);

            // Join the room via socket
            socketService.joinRoom(roomId);

            // Fetch existing messages
            await fetchMessages(roomId);

            // Listen for new messages
            socketService.onNewMessage((newMessage) => {
                const formattedMessage = {
                    id: newMessage.id,
                    sender: newMessage.sender_id === currentUserId ? 'trainer' : 'trainee',
                    text: newMessage.message,
                    time: new Date(newMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    senderId: newMessage.sender_id
                };
                setMessages(prevMessages => [...prevMessages, formattedMessage]);
            });
        } catch (err) {
            console.error('Error selecting trainee:', err);
            setError('Failed to load chat');
        } finally {
            setLoadingConvo(false);
        }
    };

    const handleSendMessage = async (messageText) => {
        if (!currentRoomId || !currentUserId || !messageText.trim()) return;

        try {
            // Send via API (which will also emit via socket)
            // The socket listener will handle adding message to state
            await chatService.sendMessage(currentRoomId, currentUserId, messageText);
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message');
        }
    };

    useEffect(() => {
        fetchTrainees();

        // Cleanup on unmount
        return () => {
            socketService.offNewMessage();
        };
    }, []);

  return (
    <div className='min-h-screen max-h-screen flex bg-gray-100 overflow-hidden'>
        {/** Sidebar */}
        <SidebarTrainer mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/**Main Content */}
        <main className='flex-1 min-h-screen flex flex-col overflow-hidden'>
            
            {/**Header*/}
        <header className="sm:px-8 sm:py-4 px-4 py-3  bg-white shadow flex items-center justify-between gap-4">
          <div className='flex items-center gap-2'>
                        <button
              className="md:hidden bg-white text-green-700 rounded-lg p-2 cursor-pointer hover:bg-gray-200 transition"
              onClick={handleOpenSidebars}
              aria-label="Open sidebar"
            >
              <Menu className="w-7 h-7" />
            </button>
          <section>

            <h1 className="text-2xl font-bold text-green-700">Messages</h1>
            <p>Message your trainees</p>
          </section>
          </div>
          <Logout />
        </header>

        {/** Page Content */}
        
        <section className='flex-1 overflow-hidden bg-gray-100 flex'>
            <TraineeList 
                trainees={trainees} 
                loading={loading} 
                selectedTrainee={selectedTrainee}
                onSelectTrainee={handleSelectTrainee}
                mobileOpen={listOpen}
                setMobileOpen={setListOpen}
                onBackClick={handleBackClick}
            />
            
            {selectedTrainee ? (
                <ChatArea 
                    selectedTrainee={selectedTrainee}
                    selectedTraineeData={selectedTraineeData}
                    loadingConvo={loadingConvo}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onBackClick={handleBackClick}
                />
            ) : (
                <EmptyState />
            )}
        </section>

        </main>
    </div>
  )
}

export default TrainerMessagePage