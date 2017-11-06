// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import { BotConfig } from "./botConfig";

let style = document.createElement("style");
style.type = "text/css";

if (BotConfig.header.visible) {
    style.innerHTML = ".wc-header {background-color: " + (BotConfig.header.backgroundColor || "#3a96dd") + "; color: " + (BotConfig.header.textColor || "white") + ";}";
}
else {
    style.innerHTML = ".wc-header {display:none} .wc-message-groups { top: auto }";
}

if (!BotConfig.uploadButton)
    style.innerHTML += ".wc-upload {display: none} .wc-textbox {left: 10px; right: 0}";

document.getElementsByTagName('head')[0].appendChild(style);

declare var BotChat:any;

BotChat.App({
    directLine: { secret: BotConfig.bot.directLineSecret },
    user: { id: BotConfig.bot.userId, name: BotConfig.bot.userName },
    bot: { id: BotConfig.bot.botId, name: BotConfig.bot.botName },
    resize: 'detect'
  }, document.getElementById("bot"));