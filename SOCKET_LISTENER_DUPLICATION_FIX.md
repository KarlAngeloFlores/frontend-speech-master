## Socket Listener Duplication Fix - Messages Sent 2X

### Problem
Messages were being sent/displayed twice when selected trainee/trainer multiple times.

### Root Cause
**Multiple Socket Listeners Not Being Removed**

Every time `handleSelectTrainee()` or `handleSelectTrainer()` was called, a **new socket listener was registered** without removing the old one.

**Example Scenario:**
```
1. User selects Trainee A
   └─ socketService.onNewMessage() adds listener 1

2. User selects Trainee B (or switches chat)
   └─ socketService.onNewMessage() adds listener 2
   └─ Listener 1 is STILL ACTIVE! ❌

3. User sends a message
   ├─ Backend broadcasts "newMessage" event
   ├─ Listener 1 fires → message added to state
   ├─ Listener 2 fires → SAME message added AGAIN
   └─ Result: Message appears 2x ❌

4. User selects Trainee C
   └─ socketService.onNewMessage() adds listener 3
   └─ Listeners 1 & 2 are STILL ACTIVE!

5. User sends message
   ├─ Listener 1 fires
   ├─ Listener 2 fires
   ├─ Listener 3 fires
   └─ Result: Message appears 3x ❌❌
```

### Socket Listener Memory Leak
The listeners were accumulating and never being cleaned up. Each time you switched chats, the old listener remained active.

```javascript
// ❌ BROKEN - Adds listener without removing old one
const handleSelectTrainee = async (traineeName, traineeData) => {
    // ... setup code ...
    
    socketService.onNewMessage((newMessage) => {
        // This listener is added
        // But the PREVIOUS listener (if any) is never removed!
    });
};
```

### Solution
**Remove the old listener BEFORE adding a new one**

```javascript
// ✅ FIXED - Remove old listener first
const handleSelectTrainee = async (traineeName, traineeData) => {
    // Remove old listener before adding new one
    socketService.offNewMessage();  // ← NEW LINE
    
    // ... setup code ...
    
    socketService.onNewMessage((newMessage) => {
        // Now only ONE listener is active
    });
};
```

### Changes Made

**TrainerMessagePage.jsx (Line 81):**
```javascript
try {
    socketService.offNewMessage();  // ← ADDED THIS
    
    const roomResponse = await chatService.createOrGetChatRoom(...);
    // ... rest of code ...
    socketService.onNewMessage((newMessage) => { ... });
}
```

**TraineeMessagePage.jsx (Line 81):**
```javascript
try {
    socketService.offNewMessage();  // ← ADDED THIS
    
    const roomResponse = await chatService.createOrGetChatRoom(...);
    // ... rest of code ...
    socketService.onNewMessage((newMessage) => { ... });
}
```

### How It Works Now

**Proper Socket Listener Lifecycle:**
```
1. User selects Trainee A
   └─ Listener 1 created

2. User selects Trainee B
   └─ socketService.offNewMessage() removes Listener 1 ✅
   └─ Listener 2 created (clean state)

3. User sends a message
   ├─ Listener 2 fires → message added ONCE ✅
   └─ Result: Message appears 1x ✅

4. User selects Trainee C
   └─ socketService.offNewMessage() removes Listener 2 ✅
   └─ Listener 3 created (clean state)

5. User sends message
   ├─ Listener 3 fires → message added ONCE ✅
   └─ Result: Message appears 1x ✅
```

### Socket Listener Cleanup Strategy
```
Listener Lifecycle:
┌──────────────────────────────────────┐
│ User selects trainee/trainer         │
│                                      │
│ 1. offNewMessage() ────┐             │
│    (cleanup old)       │             │
│                        ↓             │
│ 2. Setup chat room     │             │
│    (fetch messages)    │             │
│                        ↓             │
│ 3. onNewMessage()      │             │
│    (add new listener)  │             │
│                        ↓             │
│ ┌─ Listener is now active and ready │
│ │                                    │
│ └─ When switching again, repeat...   │
└──────────────────────────────────────┘
```

### Why offNewMessage() Before Setup?
**Critical Timing:**
1. **Before `onNewMessage()`**: Must remove old listener so only one is active
2. **After room setup**: Ensures we have the correct roomId and data ready
3. **Placement**: Right after entering the try block, before any setup

### Additional Cleanup (Already in Place)
```javascript
useEffect(() => {
    // ... code ...
    
    // Cleanup on component unmount
    return () => {
        socketService.offNewMessage();  // ✅ Already present
    };
}, []);
```

This ensures listeners are removed when the component is destroyed.

### Files Modified
- `src/pages/trainer/TrainerMessagePage.jsx`
- `src/pages/trainee/TraineeMessagePage.jsx`

### Testing
- [x] Select trainee/trainer multiple times
- [x] Send message - should appear ONCE
- [x] Switch between different chats
- [x] Each chat maintains separate listener
- [x] No memory leaks from old listeners

### Performance Impact
- **Before**: N listeners accumulating (where N = times user switched chats)
- **After**: Always exactly 1 listener active
- **Improvement**: Prevents memory leaks and eliminates duplication

### Common Socket Listener Patterns

**Pattern 1: Event-driven listeners (requires cleanup)**
```javascript
// ❌ BAD - Listeners accumulate
listeners = [];
function addListener(callback) {
    socket.on('event', callback);
    listeners.push(callback); // Grows unbounded
}

// ✅ GOOD - Cleanup before adding
function setupListener(callback) {
    socket.off('event'); // Remove all previous listeners
    socket.on('event', callback); // Add new one only
}
```

**Pattern 2: Conditional registration (also bad)**
```javascript
// ❌ BAD - Multiple listeners if condition is true multiple times
if (someCondition) {
    socket.on('newMessage', handler);
}

// ✅ GOOD - Always cleanup first
socket.off('newMessage');
if (someCondition) {
    socket.on('newMessage', handler);
}
```

### Debugging Socket Listeners
If you suspect listener issues in the future:

```javascript
// In browser console:
const socket = socketService.getSocket();

// List all listeners for an event
socket._callbacks['newMessage']  // Shows array of listeners

// Should show only 1 listener when chat is open
console.log(socket._callbacks['newMessage'].length);  // Should be 1
```

### Summary
✅ Always remove old listeners before adding new ones
✅ Prevents memory leaks from accumulating listeners
✅ Eliminates duplicate message issues
✅ Ensures single listener per active chat session
