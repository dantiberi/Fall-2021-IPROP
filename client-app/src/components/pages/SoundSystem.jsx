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

export default SoundSystem;

