import React from "react";

import styles from "./ProgressBar.module.scss";

interface ProgressBarProperties {
    alpha: number
}

const ProgressBar: React.FC<ProgressBarProperties> = (props) => {
    return (
        <div className={styles.red}>
            <div className={styles.green} style={{width: `${props.alpha * 100}%`}}/>
        </div>
    );
};

export default ProgressBar;