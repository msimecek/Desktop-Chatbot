const packager = require("electron-packager");
const electronInstaller = require('electron-winstaller');

const packagerOptions = 
{
    dir: "../",
    out: "../../out",
    asar: true,
    overwrite: true,
    icon: "../assets/icon.ico",
    win32metadata: {
        ProductName: "Chatbot",
        FileDescription: "Chatbot"
    }
}

const installerOptions = 
{
    appDirectory: "../../out/Chatbot-win32-x64",
    outputDirectory: "../../out/installer",
    authors: "Martin Simecek",
    exe: "Chatbot.exe",
    setupIcon: "../assets/icon.ico"
}

packager(packagerOptions).then((appPaths) => { 
    console.log("Packaging done!");
    var resultPromise = electronInstaller.createWindowsInstaller(installerOptions);
    console.log("Creating installer...");
    resultPromise.then(() => console.log("Installer created!"), (e) => console.log("Installer not created: " + e.message));
});



