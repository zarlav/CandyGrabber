import { config } from "../config.js";

async function login(Username, Password) {
    const response = await fetch(`${config.apiBaseUrl}User/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ Username, Password })
    });
    console.log("LOGIN STATUS:", response.status);
    console.log("LOGIN URL:", response.url);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Login failed");
    }

    const user = await response.json();

    localStorage.setItem("userId", user.id);
    localStorage.setItem("username", user.username);

    return user;
}

async function register(userDTO) {
    const formData = new FormData();
    formData.append("Username", userDTO.Username);
    formData.append("Name", userDTO.Name);
    formData.append("LastName", userDTO.LastName);
    formData.append("Password", userDTO.Password);
    formData.append("RepeatedPassword", userDTO.RepeatedPassword);

    const response = await fetch(`${config.apiBaseUrl}User/Register`, {
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

function getCurrentUserId() {
    return localStorage.getItem("userId");
}

function getCurrentUsername() {
    return localStorage.getItem("username");
}

function logout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
}

export const authService = { 
    login, 
    register, 
    getCurrentUserId, 
    getCurrentUsername, 
    logout 
};