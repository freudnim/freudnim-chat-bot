
import { handleCommands } from "./src/commands.js";
import { handleRedeems } from "./src/redeems.js";
import { handleMultiShoutout, handleAutoShoutout, shoutout } from "./src/shoutout.js";
import { SECRET_CONFIG } from "./../config.js";

const client = new tmi.Client({
  options: { debug: true, skipUpdatingEmotesets: true },
  identity: {
    username: SECRET_CONFIG.TWITCH_BOT_USERNAME,
    password: SECRET_CONFIG.TWITCH_OAUTH_TOKEN,
  },
  channels: [SECRET_CONFIG.STREAMER_USERNAME],
});

const commands = {
  test: {
    response: "👽",
  },
  raid: {
    response: [
      "hello there freudnPeek hello there freudnPeek hello there freudnPeek",
      "hello there |v ' ) hello there |v ' ) hello there |v ' )",
    ],
  },
  lurk: {
    response: (data) => {
      const { channel, senderUsername } = data;
      const lurkResponse = `/me be safe ${senderUsername} inaPray`;
      client.say(channel, lurkResponse);
    }
  },
  so: {
    response: (data) => {
      const { channel, message, senderUsername, messageArguments: usersToSO } = data;
      handleMultiShoutout(client, channel, message, senderUsername, usersToSO);
    }
  },
  freud: {
    response: (data) => {
      const { channel, senderUsername } = data;
      shoutout(client, channel, senderUsername);
    }
  }
};

client.on("message", (channel, tags, message, self) => {
  const messageData = {
    channel, // name of channel message was sent in
    message, // full entire message
    messageArguments: message.substring(message.indexOf(" ") + 1), // command arguments
    tags,
    senderUsername: tags.username.toLowerCase()
  }
  handleRedeems(client, messageData);
  handleCommands(client, messageData, commands);
  handleAutoShoutout(client, messageData);
});

client.connect();


