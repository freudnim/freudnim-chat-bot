
import { handleCommands } from "./src/commands.js";
import { handleRedeems } from "./src/redeems.js";
import { handleAutoShoutout } from "./src/shoutout.js";
import { SECRET_CONFIG } from "./../config.js";

const client = new tmi.Client({
  options: { debug: true, skipUpdatingEmotesets: true },
  identity: {
    username: SECRET_CONFIG.TWITCH_BOT_USERNAME,
    password: SECRET_CONFIG.TWITCH_OAUTH_TOKEN,
  },
  channels: [SECRET_CONFIG.STREAMER_USERNAME],
});

client.on("message", (channel, tags, message, self) => {
  const messageData = {
    channel, // name of channel message was sent in
    message, // full entire message
    messageArguments: message.substring(message.indexOf(" ") + 1), // command arguments
    tags,
    senderUsername: tags.username.toLowerCase()
  }
  handleRedeems(client, messageData);
  handleCommands(client, messageData);
  handleAutoShoutout(client, messageData);
});

client.connect();


