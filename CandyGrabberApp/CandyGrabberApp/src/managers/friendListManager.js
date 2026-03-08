export class FriendListManager {
    constructor(baseUrl)
    {
        this.baseUrl = baseUrl;
    }
async getFriendList(userId)
{
    const response = await fetch(`${this.baseUrl}FriendsList/GetAllFriends/${userId}`);

    if(!response.ok)
    {
        throw new Error("Failed to load friend list");
    }

    const text = await response.text();

    return text ? JSON.parse(text) : [];

}

async checkIfFriends(UserName, FriendName)
{
    const response = await fetch(`${this.baseUrl}FriendsList/CheckIfFriendRequestSent/${UserName}/${FriendName}`);

    if(!response.ok)
    {
        throw new Error("Failed friend checking");
    }
    const isFriend = await response.json();
    return isFriend;
}
}