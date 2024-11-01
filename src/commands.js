export function handleCommands(client, data, commands) {
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
            for (str of response) client.say(channel, str);
        }
    }
}