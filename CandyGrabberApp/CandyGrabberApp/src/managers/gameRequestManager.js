export class GameRequestManager {

    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

async send(request) {
    const response = await fetch(
        `${this.baseUrl}/GameRequest/SendGameRequest`,
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
}

async getByRecipient(recipientId) {
    console.log("getByRecipient called with:", recipientId); 
    const response = await fetch(
        `${this.baseUrl}/GameRequest/GetAllGameRequestByRecipientId/${recipientId}`
    );

    if (!response.ok) {
        throw new Error("Failed to load requests");
    }

    const text = await response.text();
    console.log("Response text:", text); 

    return text ? JSON.parse(text) : [];
}



    async accept(requestId) {
        const response = await fetch(
            `${this.baseUrl}/GameRequest/AcceptGameRequest/${requestId}`,
            { method: "PUT" }
        );

        return response.json();
    }

    async decline(requestId) {
        await fetch(
            `${this.baseUrl}/GameRequest/DeclineGameRequest/${requestId}`,
            { method: "DELETE" }
        );
    }
}
