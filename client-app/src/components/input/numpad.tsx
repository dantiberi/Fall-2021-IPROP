import React, { useCallback, useEffect, useState } from "react";

import styles from "./numpad.module.scss";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CheckIcon from '@mui/icons-material/Check';

//Link to grid layout grid.layoutit.com?id=GINfCeW

interface NumpadProps {
    onSubmit(arg: string): void; //Ran when the enter key is pressed.
}

type NonNumberButton = "Dot"
                     | "Enter"
                     | "Clear"
                     | "Negative"
                     | "Backspace"
                     | "FractionBar";

/*
Props: onSubmit = function(string)
    -Called when enter button is pressed with the collected input as the string parameter.
 */
const NumPad: React.FC<NumpadProps> = (props) => {
    const onSubmit = props.onSubmit;

    const [answer, setAnswer] = useState("");

    const handleButtonPress = useCallback((button: number | NonNumberButton) => {
        switch(button) {      
            case "Dot":
                // Only add a decimal point if there are none already in the answer
                if (!answer.includes(".")) {
                    setAnswer(answer + ".");
                }
                break;
            case "Enter":
                console.log("Submit");
                // Handle submit
                onSubmit(answer);
                setAnswer("");
                break;
            case "Clear":
                setAnswer("");
                break;
            case "Negative":
                if (answer.length > 0 && answer[0] === "-") { 
                    // Change from negative to positive
                    setAnswer(answer.substring(1));
                } else {
                    // Change from positive to negative
                    setAnswer("-" + answer);
                }
                break;
            case "Backspace":
                if (answer.length > 0) {
                    setAnswer(answer.substring(0, answer.length-1));
                }
                break;
            case "FractionBar":
                if (!answer.includes("/")) {
                    setAnswer(answer + "/");
                }
                break;
            default:
                // button is implicitly of type 'number' here, since we've exhausted other cases above
                setAnswer(answer + button.toString());
                break;
        }
    }, [onSubmit, answer, setAnswer]);

    useEffect(() => {
        /*
        This code is used to capture keyboard input and push it to the numpad display.
        */
        //Code partially from https://javascript.plainenglish.io/how-to-detect-a-sequence-of-keystrokes-in-javascript-83ec6ffd8e93

        const onKeyDown = (event: KeyboardEvent) => {
            if(!(isNaN(parseInt(event.key)))) { // If number is entered
                console.log(event.key);
                handleButtonPress(parseInt(event.key));
            }

            switch(event.key)
            {
                case 'Enter':
                    handleButtonPress("Enter");
                    break;
                case '-':
                    handleButtonPress("Negative");
                    break;
                case '.':
                    handleButtonPress("Dot");
                    break;
                case '/':
                    handleButtonPress("FractionBar");
                    break;
                case 'Backspace':
                    handleButtonPress("Backspace");
                    break;
                case 'Delete':
                    handleButtonPress("Backspace");
                    break;
                case ' ':
                    handleButtonPress("Backspace");
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => document.removeEventListener('keydown', onKeyDown);
    }, [handleButtonPress]);

    const buttonStyle = (style: string) => [styles.numpad_button, style].join(" ");
    
    return (
        <div className={styles.numpad_container}>
            <span className={styles.numpad_display}>
                <h3 className="numpad_display_text" onClick={() =>handleButtonPress("Backspace")}>&gt;{answer}</h3>
            </span>            
            <button onClick={() => handleButtonPress(7)} className={buttonStyle(styles.num7)}>7</button>
            <button onClick={() => handleButtonPress(8)} className={buttonStyle(styles.num8)}>8</button>
            <button onClick={() => handleButtonPress(9)} className={buttonStyle(styles.num9)}>9</button>
            <button onClick={() => handleButtonPress(4)} className={buttonStyle(styles.num4)}>4</button>
            <button onClick={() => handleButtonPress(5)} className={buttonStyle(styles.num5)}>5</button>
            <button onClick={() => handleButtonPress(6)} className={buttonStyle(styles.num6)}>6</button>
            <button onClick={() => handleButtonPress(1)} className={buttonStyle(styles.num1)}>1</button>
            <button onClick={() => handleButtonPress(2)} className={buttonStyle(styles.num2)}>2</button>
            <button onClick={() => handleButtonPress(3)} className={buttonStyle(styles.num3)}>3</button>
            <button onClick={() => handleButtonPress(0)} className={buttonStyle(styles.num0)}>0</button>
            <button onClick={() => handleButtonPress("Dot")} className={buttonStyle(styles.numdot)}><FiberManualRecordIcon sx={{ fontSize: "75%" }} /></button>
            <button onClick={() => handleButtonPress("Enter")} className={buttonStyle(styles.numenter)}><span><CheckIcon sx={{ fontSize: "140%"}} /></span></button>
            <button onClick={() => handleButtonPress("Clear")} className={buttonStyle(styles.numclear)}>C</button>
            <button onClick={() => handleButtonPress("Negative")} className={buttonStyle(styles.numneg)}>-</button>
            <button onClick={() => handleButtonPress("FractionBar")} className={buttonStyle(styles.numfrac)}>/</button>
        </div>
    );
};

export default NumPad;
