import { Notification } from "../ui/notification.js";
import { app } from "../App.js";

export class FriendRequestManager {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async send(request) {
        try {
            const response = await fetch(
                `${this.baseUrl}FriendRequest/SendFriendRequest/${request.userId}/${request.friendUsername}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(request)
                }
            );

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text);
            }

            return await response.json();
        } catch (err) {
            console.error("FriendRequestManager.send:", err);
            throw err;
        }
    }

    async getByRecipient(username) {
        try {
            const response = await fetch(`${this.baseUrl}FriendRequest/GetAllFriendRequests/${username}`);
            if (!response.ok) throw new Error("Failed to load friend requests");

            const text = await response.text();
            return text ? JSON.parse(text) : [];
        } catch (err) {
            console.error("FriendRequestManager.getByRecipient:", err);
            return [];
        }
    }

    async accept(requestId) {
        try {
            const response = await fetch(`${this.baseUrl}FriendRequest/AcceptFriendRequest/${requestId}`, { method: "POST" });
            if (!response.ok) throw new Error("Failed to accept friend request");
            return await response.json();
        } catch (err) {
            console.error("FriendRequestManager.accept:", err);
            throw err;
        }
    }

    async decline(requestId) {
        try {
            await fetch(`${this.baseUrl}FriendRequest/DeclineFriendRequest/${requestId}`, { method: "POST" });
        } catch (err) {
            console.error("FriendRequestManager.decline:", err);
        }
    }
}