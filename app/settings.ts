import * as Electron from "electron";
import * as Fs from "fs";
import * as Mkdirp from "mkdirp";

import { defaultSettings } from "./defaultSettings";

export function loadSettings(filename: string) 
{
    try {
        filename = ensureStoragePath() + "/" + filename;
        const stat = Fs.statSync(filename);
        if (stat.isFile()) {
            return JSON.parse(Fs.readFileSync(filename, "utf-8"));
        }
        return defaultSettings;
    } catch (e) {
        console.error(`Failed to read: ${filename}`, e);
        return defaultSettings;
    }

}

export function saveSettings(filename: string, settings)
{
    filename = ensureStoragePath() + "/" + filename;
    Fs.writeFileSync(filename, JSON.stringify(settings, null, 2));
}

export function resetSettings(fileName: string) {
    saveSettings(fileName, defaultSettings);
}

const ensureStoragePath = (): string => {
    const app = Electron.app || Electron.remote.app;
    const USER_DATA_PATH = app.getPath('userData');
    const path = `${USER_DATA_PATH}/chatbot`;
    Mkdirp.sync(path);
    return path;
}