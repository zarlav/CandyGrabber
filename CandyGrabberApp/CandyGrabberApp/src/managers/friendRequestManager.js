import { Notification } from "../ui/notification.js";
import { app } from "../App.js";

export class FriendRequestManager {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    // Odgovara tvojoj ruti: [Route("SendFriendRequest/{userId}/{friendUsername}")]
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

    // Odgovara tvojoj ruti: [Route("GetAllFriendRequests")] uz string username
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

    // Odgovara tvojoj ruti: [Route("AcceptFriendRequest")] uz int requestId kao Query Param
    async accept(requestId) {
        try {
            // Čistimo ID (npr. "1:1" postaje "1")
            const match = String(requestId).match(/^\d+/);
            const cleanId = match ? match[0] : requestId;

            console.log(`Slanje Accept zahteva za ID: ${cleanId}`);

            // Koristimo ?requestId= jer u kontroleru requestId NIJE deo [Route] stringa
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

    // Odgovara tvojoj ruti: [Route("DeclineFriendRequest")] uz int requestId kao Query Param
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

    // Odgovara tvojoj ruti: [Route("CheckIfFriendRequestSent/{UserName}/{FriendName}")]
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