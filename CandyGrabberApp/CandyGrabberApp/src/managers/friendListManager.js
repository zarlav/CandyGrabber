export class FriendListManager {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async getFriendList(userId) {
        try {
            const response = await fetch(`${this.baseUrl}FriendsList/GetAllFriends/${userId}`);
            if (!response.ok) throw new Error("Failed to load friend list");

            const text = await response.text();
            return text ? JSON.parse(text) : [];
        } catch (err) {
            console.error("FriendListManager.getFriendList:", err);
            return [];
        }
    }

    async checkIfFriends(UserName, FriendName) {
        try {
            const response = await fetch(`${this.baseUrl}FriendsList/CheckIfFriendRequestSent/${UserName}/${FriendName}`);
            if (!response.ok) throw new Error("Failed to check friendship");

            return await response.json();
        } catch (err) {
            console.error("FriendListManager.checkIfFriends:", err);
            return false;
        }
    }
}