import { config } from "../config.js";

async function login(Username, Password) {
    const response = await fetch(`${config.apiBaseUrl}/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ Username, Password })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Login failed");
    }
    return await response.json();
}

async function register(userDTO) {
    const formData = new FormData();
    formData.append("Username", userDTO.Username);
    formData.append("Name", userDTO.Name);
    formData.append("LastName", userDTO.LastName);
    formData.append("Password", userDTO.Password);
    formData.append("RepeatedPassword", userDTO.RepeatedPassword);

    const response = await fetch(`${config.apiBaseUrl}/Register`, {
        method: "POST",
        credentials: "include",
        body: formData
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Registration failed");
    }
    return await response.json();
}

export const authService = { login, register };