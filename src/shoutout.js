import oshimarks from "./../oshimarks.json" with { type: 'json' };
import { SECRET_CONFIG } from "./../config.js";

const headers = {
    "Client-ID": SECRET_CONFIG.MY_CLIENT_ID,
    Authorization: `Bearer ${SECRET_CONFIG.MY_AUTH_TOKEN}`,
};

const STREAMER_USERNAME = SECRET_CONFIG.STREAMER_USERNAME;

/**
 * broadcaster_type
 * created_at
 * description
 * display_name
 * id
 * login
 * offline_image_url
 * profile_image_url
 * type
 * view_count
 */
var genUserInfoFromNames = (names) => {
    return $.ajax({
        url: `https://api.twitch.tv/helix/users?${names.reduce(
            (prev, curr) => prev + `login=${curr}&`,
            ""
        )}}`,
        type: "get",
        headers,
    });
};
/**
 * broadcaster_id
 * broadcaster_language
 * broadcaster_login
 * broadcaster_name
 * content_classification_labels
 * delay
 * game_id
 * game_name
 * is_branded_content
 * tags
 * title
 */
var genChannelInfoFromIds = (ids) => {
    return $.ajax({
        url: `https://api.twitch.tv/helix/channels?${ids.reduce(
            (prev, curr) => prev + `broadcaster_id=${curr}&`,
            ""
        )}}`,
        type: "get",
        headers,
    });
};

var genChannelStreamsFromName = (name) => {
    return $.ajax({
        url: `https://api.twitch.tv/helix/streams?user_login=${name}`,
        type: "get",
        headers,
    });
};

var genChannelInfoFromName = (name) => {
    return $.ajax({
        url: `https://api.twitch.tv/helix/users?login=${name}`,
        type: "get",
        headers,
    });
};

var genChannelInfoFromId = (id) => {
    return $.ajax({
        url: `https://api.twitch.tv/helix/channels?broadcaster_id=${id}`,
        type: "get",
        headers,
    });
};

function getShoutoutString(data, name, game) {
    const isLive = data.length != 0;
    let shoutoutString = " 【 📣 twitch.tv/" + name;
    if (game.length != 0) {
        shoutoutString += " ☆ " + game;
    }
    if (oshimarks[name.toLowerCase()]) {
        shoutoutString += " ☆ " + oshimarks[name.toLowerCase()];
    }
    shoutoutString += isLive ? " ☆ LIVE 🔴 】 " : " 】 ";
    return shoutoutString;
}

export function shoutout(client, channel, userToSO) {
    genChannelInfoFromName(userToSO).done((response) => {
        const id = response.data[0].id;
        genChannelInfoFromId(id).done((response) => {
            const lastPlayedGame = response.data[0].game_name;
            const shoutoutString = getShoutoutString([], userToSO, lastPlayedGame);
            client.say(
                channel,
                `${shoutoutString} freudnHeh`
            );
        });
    });
}

export function handleMultiShoutout(client, channel, message, username, users) {
    // Sanitize
    users = users.replaceAll("@", "").replaceAll(/^\s+|\s+$/g, " ").trim();
    users = users.replaceAll(/[\uD800-\uDFFF]/g, ' ') // remove UTF-16 surrogates 
    users = users.split(" ");
    users = users.filter(n => n);

    // Circumvent shoutouts to the streamer
    const selfMsg = username.toLowerCase() === STREAMER_USERNAME;
    if ((users.includes(STREAMER_USERNAME) && !selfMsg)) {
        users = users.filter(user => user !== STREAMER_USERNAME);
        shoutout(client, channel, username);
    }

    // Fetch their ids...
    genUserInfoFromNames(users).done((response) => {
        const ids = response.data.map((data) => {
            return data.id;
        });
        // ... to get their recently played games
        genChannelInfoFromIds(ids).done((response) => {
            const namesToGames = {};
            response.data.forEach((data) => {
                namesToGames[data.broadcaster_name] = data.game_name;
            });
            let shoutoutString = "";
            Object.keys(namesToGames).map((name) => {
                // Then fetch their stream info to check if they're streaming
                const game = namesToGames[name];
                genChannelStreamsFromName(name).done((response) => {
                    shoutoutString += getShoutoutString(response.data, name, game);
                });
            });
            setTimeout(
                () => {
                    client.say(channel, shoutoutString);
                },
                users < 5 ? 200 : 500
            );
        });
    });
}

const chatters = [];
export function autoShoutout(client, data) {
    const username = data.senderUsername
    if (!chatters.includes(username)) {
        chatters.push(username);
        if (Object.keys(oshimarks).includes(username)) {
            setTimeout(() => {
                client.say(data.channel, "!so " + username);
            }, 5000);
        }
    }
}