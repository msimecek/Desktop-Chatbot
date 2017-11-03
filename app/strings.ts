interface IStrings {
    open: string,
    quit: string
}

interface LocalizedStrings {
    [locale: string]: IStrings;
}

const localizedStrings: LocalizedStrings = {
    "en-us": {
        open: "Open",
        quit: "Quit"
    },
    "cs-cz": {
        open: "Otevřít",
        quit: "Ukončit"
    }
}

export const defaultStrings = localizedStrings['en-us'];

export const Strings = (locale: string) => {
    if (locale.startsWith('cs'))
        locale = 'cs-cz';
    else if (locale in localizedStrings === false)
        locale = 'en-us';

    return localizedStrings[locale];
}