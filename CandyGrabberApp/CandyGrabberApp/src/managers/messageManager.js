import { ChatScene } from "../scenes/chatScene.js";

export const MessageManager = {

    receive(sender, message) {
        ChatScene.addMessage(sender + ": " + message);
    }
};