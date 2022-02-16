import { useState, useEffect } from "react";
//https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent

const useAudio = url => {
    //const [audio] = useState(new Audio(url));
    useEffect(() => {
        const audio = new Audio(url);
        audio.play();
    },
        [url]
    );
};

const SoundSystem = () => {
    var [url, setUrl] = useState("");

    const soundListener = (e) => { 
        setUrl(e.detail.soundUrl)
    }

    useEffect(()=>{
        document.addEventListener('sfx', soundListener);    
        return () => {
            document.removeEventListener('sfx', soundListener);
        }
    },[])

    useAudio(url);

    return null;
};

export default SoundSystem;

