const Redeems = Object.freeze({
    // To find the redeem reward id, log tags["custom-reward-id"]
    ANNOUNCE_ME: "981dcd6d-9a36-478a-810d-fcb35d3fc1f5",
    SUB_GACHA: "bcd8ecb6-9ea1-44cd-96d5-fabe77b3a64e",
});

export function handleRedeems(client, data) {
    const { channel, message, tags } = data;
    const redeemID = tags["custom-reward-id"];
    switch (redeemID) {
        case Redeems.ANNOUNCE_ME:
            // client.timeout(channel, tags.username, 1, "redeem")
            if (message.includes("!so freudnim")) {
                client.say(channel, "Suske");
            } else {
                // chat commands deprecated through irc - feb 2023 
                // https://discuss.dev.twitch.com/t/deprecation-of-chat-commands-through-irc/40486
                // client.say(channel, "/announce " + message); 
                client.say(channel, message);
            }
            break;
        case Redeems.SUB_GACHA:
            const randomNum = Math.floor(Math.random() * 13);
            console.log("randomNum", randomNum);
            if (randomNum < 2) {
                client.say(
                    channel,
                    `@${tags.username} congrats you won a sub! kiaraClap `
                );
            } else {
                client.say(
                    channel,
                    `@${tags.username} no sub freudnSweat`
                );
            }
            break;
    }
}