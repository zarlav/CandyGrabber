import { Button } from "../../ui/button.js";

export async function renderFriendList(container, currentUserId, searchResultContainer, friendRequestManager, gameRequestManager) {
    const friendships = await friendRequestManager.getFriendList(currentUserId);
    container.removeChildren();

    let startX = 20;
    let startY = 100;

    const panel = new PIXI.Graphics();
    panel.beginFill(0x111827);
    panel.drawRoundedRect(startX, startY - 40, 320, 400, 16);
    panel.endFill();
    container.addChild(panel);

    const title = new PIXI.Text("Friends", { fill: 0xffffff, fontSize: 18, fontWeight: "bold" });
    title.x = startX + 15;
    title.y = startY - 35;
    container.addChild(title);

    let offsetY = startY;

    friendships.forEach(f => {
        const friendUser = f.userId === currentUserId ? f.friend : f.user;
        const recipientId = f.userId === currentUserId ? f.friendId : f.userId;

        const card = new PIXI.Graphics();
        card.beginFill(0x1e293b);
        card.drawRoundedRect(startX + 10, offsetY, 300, 50, 10);
        card.endFill();
        card.interactive = true;
        card.on("pointerover", () => card.tint = 0x2a3b55);
        card.on("pointerout", () => card.tint = 0xffffff);

        const nameText = new PIXI.Text(friendUser.username, { fill: 0xffffff, fontSize: 16 });
        nameText.x = startX + 20;
        nameText.y = offsetY + 15;

        const inviteBtn = new Button("Invite", startX + 210, offsetY + 10, async () => {
            try {
                const request = {
                    senderId: currentUserId,
                    recipientId: recipientId,
                    timestamp: new Date().toISOString()
                };
                await gameRequestManager.send(request);

                inviteBtn.setText("Sent");
                inviteBtn.container.interactive = false;
                inviteBtn.container.alpha = 0.6;
            } catch (err) {
                console.error(err);
            }
        });

        container.addChild(card);
        container.addChild(nameText);
        container.addChild(inviteBtn.container);

        offsetY += 60;
    });
}