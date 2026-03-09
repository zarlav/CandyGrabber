import { connection } from "../../signalR/connection.js";

export function registerFriendRequestEvents(lobbyScene, friendRequestManager) {
    connection.on("FriendRequestSent", async (senderUsername) => {
        console.log(`Friend request from: ${senderUsername}`);

        // opcionalno refresh friend request UI ili badge
        // primer: reload friend list
        await friendRequestManager.getByRecipient(lobbyScene.currentUserId);
    });
}