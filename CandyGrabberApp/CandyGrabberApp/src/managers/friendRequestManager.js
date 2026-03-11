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
                    headers: { "Content-Type": "application/json" }
                }
            );
            if (!response.ok) throw new Error(await response.text());
            return await response.json();
        } catch (err) {
            console.error("FriendRequestManager.send:", err);
            throw err;
        }
    }

    async getByRecipient(username) {
        try {
            const response = await fetch(`${this.baseUrl}FriendRequest/GetAllFriendRequests?username=${username}`);
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
            const match = String(requestId).match(/^\d+/);
            const cleanId = match ? match[0] : requestId;

            console.log(`Slanje Accept zahteva za ID: ${cleanId}`);
            const response = await fetch(`${this.baseUrl}FriendRequest/AcceptFriendRequest?requestId=${cleanId}`, { 
                method: "POST" 
            });

            if (!response.ok) throw new Error(`Server Error: ${response.status}`);
            return await response.json();
        } catch (err) {
            console.error("FriendRequestManager.accept:", err);
            throw err;
        }
    }

    async decline(requestId) {
        try {
            const match = String(requestId).match(/^\d+/);
            const cleanId = match ? match[0] : requestId;
            
            const response = await fetch(`${this.baseUrl}FriendRequest/DeclineFriendRequest?requestId=${cleanId}`, { 
                method: "POST" 
            });
            
            if (!response.ok) throw new Error(`Server Error: ${response.status}`);
        } catch (err) {
            console.error("FriendRequestManager.decline:", err);
        }
    }

    async checkStatus(userName, friendName) {
        try {
            const response = await fetch(`${this.baseUrl}FriendRequest/CheckIfFriendRequestSent/${userName}/${friendName}`);
            if (!response.ok) return false;
            return await response.json();
        } catch (err) {
            console.error("FriendRequestManager.checkStatus:", err);
            return false;
        }
    }
}