const soundLibrary = require('../assets/sounds.json');

export const sfxErrr = new CustomEvent('sfx', {
    detail: {
        soundUrl: soundLibrary.errr
    }
});

export const sfxRoar = new CustomEvent('sfx', {
    detail: {
        soundUrl: soundLibrary.roar
    }
});