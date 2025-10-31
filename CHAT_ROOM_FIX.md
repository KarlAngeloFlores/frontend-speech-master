## Chat Room Parameter Order Fix

### Problem
When a trainee clicked on a trainer, a NEW chat room was being created instead of joining the EXISTING room created by the trainer. This resulted in:
- Trainer in room with `trainer_id=X, trainee_id=Y`
- Trainee in room with `trainer_id=Y, trainee_id=X` (WRONG!)

### Root Cause
The `createOrGetChatRoom()` function expects parameters in order: `(trainerId, traineeId)`

**TrainerMessagePage (Correct):**
```javascript
chatService.createOrGetChatRoom(currentUserId, traineeData.id)
// Params: trainerId, traineeId ✅
```

**TraineeMessagePage (Incorrect - FIXED):**
```javascript
// BEFORE:
chatService.createOrGetChatRoom(currentUserId, trainerData.id)
// Params: traineeId, trainerId ❌ (WRONG ORDER!)

// AFTER:
chatService.createOrGetChatRoom(trainerData.id, currentUserId)
// Params: trainerId, traineeId ✅ (CORRECT!)
```

### Backend Lookup Logic
```javascript
const existingRoom = await ChatRoom.findOne({
    where: {
        trainer_id: trainerId,      // First parameter
        trainee_id: traineeId       // Second parameter
    }
});
```

### Solution Applied
Updated `TraineeMessagePage.jsx` line 83 to pass parameters in correct order:
```javascript
// trainer_id FIRST, trainee_id SECOND
const roomResponse = await chatService.createOrGetChatRoom(trainerData.id, currentUserId);
```

### Result
✅ Trainer and trainee now share the same chat room
✅ Messages are visible to both sides
✅ Real-time socket updates work correctly
✅ No more duplicate rooms created

### Testing
1. Trainer selects trainee → creates room (trainer_id=1, trainee_id=2)
2. Trainee selects trainer → joins SAME room (trainer_id=1, trainee_id=2)
3. Messages appear in real-time for both
4. Refresh page → same room is retrieved, not a new one created
