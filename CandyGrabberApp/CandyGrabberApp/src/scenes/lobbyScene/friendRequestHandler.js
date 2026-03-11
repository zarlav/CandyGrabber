import { connection } from "../../signalR/connection.js";

export function registerFriendRequestEvents(lobbyScene, friendRequestManager) {
    connection.on("FriendRequestSent", async () => {
        const requests = await friendRequestManager.getByRecipient(lobbyScene.currentUsername);
        if (requests && Array.isArray(requests)) {
            lobbyScene.requestsContainer.removeChildren();
            requests.forEach(request => {
                lobbyScene.addFriendRequestToUI(request);
            });
        }
    });
}