import { useState, useEffect } from "react";
//https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
const audioDone = new CustomEvent('audioDone', {});

const useAudio = url => {
    //const [audio] = useState(new Audio(url));
    useEffect(() => {
        if(!(url === "")){
            const audio = new Audio(url);
            audio.play();
            audio.onended = function()
            {
                document.dispatchEvent(audioDone);
            }
        }
    },
        [url]
    );
};

const SoundSystem = () => {
    var [url, setUrl] = useState("");

    const soundListener = (e) => { 
        setUrl(e.detail.soundUrl)
    }

    document.addEventListener('audioDone', () => {
        setUrl("");//Needed otherwise URL would not change after useAudio is ran once. Thus, you could not play the same sound twice in a row.
    })

    useEffect(()=>{
        document.addEventListener('sfx', soundListener);    
        return () => {
            document.removeEventListener('sfx', soundListener);//Cleanup
        }
    },[])

    useAudio(url);

    return null;
};

//Jebra specific code below
const soundEvents = require("../SoundEvents");

//Assign sounds to monsters in the pickRandomObject array.
export const playMonsterSoundEffect = (monsterName) => {
    //Replace switch statement with object literals: https://ultimatecourses.com/blog/deprecating-the-switch-statement-for-object-literals
    var playSoundFor = {
        'dino1': function () {
            const sound = pickRandomObject([soundEvents.sfxRoar1, soundEvents.sfxRoar2, soundEvents.sfxRoar3]);
            //console.log("Playing Sound Effect:");
            document.dispatchEvent(sound);
            return;
        },
        'dino2': function () {
            return;
        },
        'dino3': function () {
            return;
        }
    };
    playSoundFor[monsterName]();
}

//objs is an array of objects
const pickRandomObject = (objs) =>{
    const idx = getRandomInt(0, objs.length);
    console.log("IDX: " + idx);
    return objs[idx];
}

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

export default SoundSystem;

