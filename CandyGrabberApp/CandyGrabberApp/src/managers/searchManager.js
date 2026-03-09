export class SearchManager {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async search(username) {
        const url = `${this.baseUrl}User/GetUserByUsername/${username}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        return data;
    }
}