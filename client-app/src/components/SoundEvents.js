const soundLibrary = require('../assets/sounds.json');

export const sfxErrr = new CustomEvent('sfx', {
    detail: {
        soundUrl: soundLibrary.errr
    }
});

export const sfxRoar1 = new CustomEvent('sfx', {
    detail: {
        soundUrl: soundLibrary.roar1
    }
});

export const sfxRoar2 = new CustomEvent('sfx', {
    detail: {
        soundUrl: soundLibrary.roar2
    }
});

export const sfxRoar3 = new CustomEvent('sfx', {
    detail: {
        soundUrl: soundLibrary.roar3
    }
});