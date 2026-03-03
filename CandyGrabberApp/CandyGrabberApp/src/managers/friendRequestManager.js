import { Notification } from "../ui/notification.js";
import { app } from "../App.js";


export class FriendRequestManager {

   constructor(baseUrl)
   {
        this.baseUrl = baseUrl;
   }
async send(request)
{
    const response = await fetch(`${this.baseUrl}FriendRequest/SendFriendRequest/${request.userId}/${request.friendUsername}`,
        {
            method : "POST",
             headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request)
        }
    );

    if(!response.ok)
    {
        const text = await response.text();
        throw new Error(text);
    }

    return await response.json();
}

async getByRecipient(username) 
{
    const response = await fetch(`${this.baseUrl}FriendRequest/GetAllFriendRequests/${username}`);

    if(!response.ok)
    {
        throw new Error("Failet to load freind requests!");
    }

    const text = await response.text();

    return text ? JSON.parse(text) : [];
}

async accept(requestId)
{
    const response = await fetch(`${this.baseUrl}FriendRequest/AcceptFriendRequest/${requestId}`,
        {method: "POST"}
    );

    return response.json();
}

async decline(requestId)
{
    await fetch(`${this.baseUrl}FriendRequest/DeclineFriendRequest/${requestId}`,
        {method : "POST"}
    );
}

}