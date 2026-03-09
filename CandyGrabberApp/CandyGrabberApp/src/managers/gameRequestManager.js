export class GameRequestManager {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async send(requestData) {
        try {
            // Clock-skew fix: šaljemo 2 min u budućnost
            const futureTime = new Date(Date.now() + 120000);
            
            const response = await fetch(`${this.baseUrl}GameRequest/SendGameRequest`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    // Šaljemo ID originalno, bez parseInt koji može da pokvari format
                    senderId: requestData.senderId, 
                    recipientId: requestData.recipientId,
                    timestamp: futureTime.toISOString()
                })
            });
            return await response.json();
        } catch (err) {
            console.error("GameRequestManager.send fatal error:", err);
            throw err;
        }
    }

    async getByRecipient(userId) {
        try {
            // CACHE BUSTER: Ključno za localhost razvoj da browser ne kešira []
            const url = `${this.baseUrl}GameRequest/GetAllGameRequestByRecipientId/${userId}?t=${Date.now()}`;
            
            const response = await fetch(url, {
                method: "GET",
                headers: { 
                    "Accept": "application/json",
                    "Cache-Control": "no-cache"
                }
            });

            if (!response.ok) return [];
            const data = await response.json();
            
            if (data && data.length > 0) {
                console.log("%c [DATA FOUND]", "background: #00ff00; color: #000", data);
            }
            return data;
        } catch (err) {
            console.error("GameRequestManager.getByRecipient error:", err);
            return [];
        }
    }

    async accept(requestId) {
        try {
            const response = await fetch(`${this.baseUrl}GameRequest/AcceptGameRequest/${requestId}`, {
                method: "PUT"
            });
            return await response.json();
        } catch (err) {
            console.error("GameRequestManager.accept error:", err);
            throw err;
        }
    }
}