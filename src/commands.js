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

export function handleCommands(client, data) {
    const { channel, message } = data;

    const firstWord = message.split(" ")[0];
    const command = firstWord.startsWith("!") ? firstWord.substring(1) : null;

    if (command) {
        const { response } = commands[command] || {};
        if (typeof response === "function") {
            // Execute some operation with the command
            response(data);
        } else if (typeof response === "string") {
            // Send the string as a message
            client.say(channel, "/me " + response);
        } else if (Array.isArray(response)) {
            // Send the array of strings as multiple message
            for (const str of response) client.say(channel, str);
        } else {
            console.log('response');
        }
    }
}