import { config } from "../config.js";

export const authService = {
    login,
};

async function login(username, password) {
    const response = await fetch(`${config.apiBaseUrl}/Login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    return await response.json(); 
}
