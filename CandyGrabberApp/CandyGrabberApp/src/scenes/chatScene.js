import { sendMessage } from "../managers/messageManager";
import { registerChatEvents } from "../signalR/chatEvents";

let messages = [];

registerChatEvents((message) => {
    messages.push(message);
    renderMessages();
});

function handleSend() {
    const input = document.getElementById("chatInput");
    sendMessage(selectedUserId, input.value);
    input.value = "";
}